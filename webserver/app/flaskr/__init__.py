import os

import json
from . import db
import json
from concurrent.futures import ThreadPoolExecutor
from flask import Blueprint, send_from_directory


from flask import Flask, request, redirect, url_for
from werkzeug.utils import secure_filename
from . import ModelUtils as mu
import time

from flask_pymongo import PyMongo
from bson.json_util import dumps
from bson.objectid import ObjectId
import mlflow
from mlflow.tracking import MlflowClient
import docker
import subprocess
import requests


UPLOAD_FOLDER = '/casterlyrock/data/'
ALLOWED_EXTENSIONS = set(['zip','txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

os.environ['MLFLOW_TRACKING_URI'] = 'http://mlflow:5000'
executor = ThreadPoolExecutor(max_workers=10)
client = MlflowClient()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True, static_folder='../build')
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
        UPLOAD_FOLDER=UPLOAD_FOLDER
    )

    app.config["MONGO_URI"] = "mongodb://mongodb:27017/myDatabase"
    mongo = PyMongo(app)

    data_saved = mongo.db.data_saved

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/api/nlp/submit', methods=['GET', 'POST'])
    def submit():
        ts = int(time.time())
        if request.method == 'POST':
            data = request.get_json()
            jobqueue = mongo.db.jobqueue
            d = {'dataset': data['DATASET'], 'output_dir': 'M_'+str(ts),'do_delete': False, 'max_seq_length': data['MAX_SEQ_LENGTH'],'batch_size': data['BATCH_SIZE'],'learning_rate': data['LEARNING_RATE'],'num_train_epochs': data['NUM_TRAIN_EPOCHS'],'warmup_proportion': data['WARMUP_PROPORTION'], 'save_checkpoints_steps':data['SAVE_CHECKPOINTS_STEPS'], 'save_summary_steps': data['SAVE_SUMMARY_STEPS'],'bert_model_hub': data['BERT_URL'], 'train_test_split': data['DATA_SPLIT'],'pre_split': data['pre_split'], 'predict_batch_size': data['PREDICT_BATCH_SIZE'],'train_batch_size': data['TRAIN_BATCH_SIZE'], 'warmup_steps': data['WARMUP_STEPS'],'save_steps': data['SAVE_STEPS'],'train_steps': data['TRAIN_STEPS'],'job_status': 'submitted', 'user_email': data['user_email']}
            obj_id = jobqueue.insert_one(d)
            ## return dummy result
            return '{"General_Negative_Feedback": {"tp": 30, "precision": 0.6521739130434783, "fn": 17, "recall": 0.6382978723404256, "fp": 16}, "refund-status": {"tp": 320, "precision": 0.8533333333333334, "fn": 48, "recall": 0.8695652173913043, "fp": 55}, "txnacctcasedetails": {"tp": 57, "precision": 0.5643564356435643, "fn": 25, "recall": 0.6951219512195121, "fp": 44}, "bye": {"tp": 6, "precision": 0.8571428571428571, "fn": 5, "recall": 0.5454545454545454, "fp": 1}, "Other": {"tp": 147, "precision": 0.6869158878504673, "fn": 87, "recall": 0.6282051282051282, "fp": 67}, "thankyou": {"tp": 10, "precision": 0.9090909090909091, "fn": 0, "recall": 1.0, "fp": 1}, "General_Connect_to_Agent": {"tp": 175, "precision": 0.9162303664921466, "fn": 11, "recall": 0.9408602150537635, "fp": 16}, "hello": {"tp": 40, "precision": 0.8695652173913043, "fn": 3, "recall": 0.9302325581395349, "fp": 6}, "ok": {"tp": 3, "precision": 1.0, "fn": 7, "recall": 0.3, "fp": 0}, "posfdbk": {"tp": 2, "precision": 0.5, "fn": 5, "recall": 0.2857142857142857, "fp": 2}}'
            #return mc.run('data/bot_dataset1', 'M_'+str(ts), False, 128,32,2e-5, 5.0,0.1,500,100, 'https://tfhub.dev/google/bert_uncased_L-12_H-768_A-12/1', 0.7)
        elif request.method == 'GET':
            collection = mongo.db.dataSaved
            ob = collection.find_one({'id': str(request.args.get('id'))})
            return dumps(ob)


    @app.route('/api/upload', methods=['GET', 'POST'])
    def upload_file():
        if request.method == 'POST':
            # check if the post request has the file part
            for filename, file in request.files.items():
                print(filename)
                if filename == '':
                    print('No selected file')
                    return "empty file name"
                if file and allowed_file(filename):
                    filename = secure_filename(filename)
                    filePath = os.path.join(app.config['UPLOAD_FOLDER'], filename);
                    file.save(filePath)
                    print("saving...")
                    print(filename)
                    return json.dumps(mu.process_file(filePath), ensure_ascii=False)
                else:
                    print("illegal filename")
                    return filename

        return "Not Post?"

    @app.route('/api/nlp/clearqueue', methods=['GET'])
    def clear_queue():
        job = mongo.db.jobqueue
        ob = job.find_one({'_id': ObjectId(request.args.get('id'))})
        print(ob)
        job.delete_one({'_id': ObjectId(request.args.get('id'))})
        data = mongo.db.dataSaved
        data.delete_one({'id': str(request.args.get('id'))})

        curr_run = client.search_runs([i.experiment_id for i in client.list_experiments()], "params.id = \'" +str(request.args.get('id')) + "\'")
        #should only have one result
        if (len(curr_run) != 0):
            client.delete_run(curr_run[0].info.run_id)


        if (ob['job_status'] != 'finished'):
            docker_client = docker.from_env()
            if 'container_name' in ob:
                container = docker_client.containers.get(ob['container_name'])
                #container.stop()
                #container.wait(timeout=10, condition='not-running')
                #container.remove()
                container.remove(force=True)
        return dumps(ob)

    @app.route('/api/nlp/experiments', methods=['GET'])
    def experiments():
        experiment_list = [i.name for i in client.list_experiments()]
        d = {}
        for i in experiment_list:
            d[i] = client.get_experiment_by_name(i)
        return dumps(d)

    @app.route('/api/nlp/jobqueue', methods=['GET'])
    def job_queue():
        collection = mongo.db.jobqueue
        ob = collection.find({'user_email': request.args.get('user_email')})
        return dumps(ob)

    @app.route('/api/nlp/datasets', methods=['GET'])
    def datasets():
        arr = []
        for (dirpath, dirnames, filenames) in os.walk(app.config['UPLOAD_FOLDER']):
            arr.extend(dirnames)
        return dumps(arr)

    @app.route('/api/nlp/intent', methods=['GET'])
    def intent():

        sentence = request.args.get('sentence')
        model_version = request.args.get('model')
        headers = {
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en,zh-CN;q=0.9,zh;q=0.8,zh-TW;q=0.7',
            'Content-Type': 'application/json',
        }

        data = {"tfserver":{"server":"localhost","port":"9000"},"callerInfo":{"service_name":"riskunifiedcomputeserv","pit_timestamp":"2015","s_l_a":"2000"},"predict":{"models":[{"name":"bert_bot_model","version":model_version,"input_sentences":[sentence]}]}}
        json_data = json.dumps(data)

        response = requests.post('https://10.176.0.75:26636/v1/nlp', headers=headers, data=json_data, verify=False)
        result = response.content.decode('ascii')
        json_result = json.loads(result)
        print(json_result)
        output_dict = {}
        for i in range(3):
            output_dict[i] = json_result['modelResults'][0]['intents'][i]['intentName'] + ' ' + str(round((json_result['modelResults'][0]['intents'][i]['score'])*100,5))
        # output_str = json_result['modelResults'][0]['intents'][0]['intentName'] + ' with Score: ' + str(json_result['modelResults'][0]['intents'][0]['score'])
        return dumps(output_dict)

    @app.route('/api/nlp/intent_nlpv2', methods=['GET'])
    def intent_nlpv2():

        sentence = request.args.get('sentence')
        model_version = '1'
        headers = {
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en,zh-CN;q=0.9,zh;q=0.8,zh-TW;q=0.7',
            'Content-Type': 'application/json',
        }

        data = {"tfserver":{"server":"localhost","port":"9000"},"callerInfo":{"service_name":"riskunifiedcomputeserv","pit_timestamp":"2015","s_l_a":"2000"},"predict":{"models":[{"name":"nlpv2","version":model_version,"input_sentences":[sentence]}]}}
        json_data = json.dumps(data)

        response = requests.post('https://10.176.0.75:26636/v1/nlp', headers=headers, data=json_data, verify=False)
        result = response.content.decode('ascii')
        json_result = json.loads(result)
        print(json_result)
        output_dict = {}
        for i in range(3):
            output_dict[i] = json_result['modelResults'][0]['intents'][i]['intentName'] + ' ' + str(round((json_result['modelResults'][0]['intents'][i]['score'])*100,5))
        return dumps(output_dict)

    @app.route('/api/nlp/try', methods=['GET'])
    def try_data():
        file = open('./cpu_NLP_BERT.sh', 'r')
        write_file = open('./cpu_NLP_BERT2.sh', 'w')
        for i in file:
            if('version' in i):
                write_file.write('\t"version": '+ '"'+ request.args.get('model') +'"' +', \n')
            else:
                write_file.write(i)
        write_file.close()
        file.close()
        return dumps('success')


    @app.route('/api/nlp/raw', methods=['GET'])
    def raw():
        collection = mongo.db.predictions_doc
        ob = collection.find_one({'id': str(request.args.get('id'))})
        return dumps(ob)

    @app.route('/api/nlp/confusion', methods=['GET'])
    def confusion():
        collection = mongo.db.confusion_matrix
        ob = collection.find_one({'id': str(request.args.get('id'))})
        return dumps(ob)
    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    @app.route('/hellomongo')
    def hellomongo():
        # online_users = mongo.db.users.find({"online": True})
        # return render_template("index.html",
        #     online_users=online_users)

        return "success"



    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "":
            return send_from_directory('../build', path)
        else:
            return send_from_directory('../build', 'index.html')

    import time
    def dummytask(layer):
        time.sleep(1)
        print ("submit for layer = " +str(layer))


    @app.route('/api/jobs', methods=['GET', 'POST'])
    def handleJobs():
        if request.method == 'POST':
            gpu = 0
            data = json.loads(request.data.decode("utf-8"))
            layerList = []
            for i in range (data['minNumLayers'], data['maxNumLayers'], data['numOfLayersStep']):
                layerList.append([i,gpu])
                if gpu== 0:
                    gpu = 1
                else:
                    gpu = 0
            print(layerList)

            executor.map(task, layerList)

            return str(len(layerList)) + " submitted"

        elif request.method == 'GET':
            list = [3,4,5,6,7,8,9,10]
            for i in list:
                executor.submit(dummytask(i))

            return "submitted"
        else:
            return "hello"


    db.init_app(app)


    return app
