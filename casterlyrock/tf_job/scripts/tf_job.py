import pymongo
from pymongo import MongoClient
import pprint
import time
import subprocess
import mclassifier as mc
from bson.objectid import ObjectId

import time
import os
import traceback
import sys

def start_new_training(updated_job, master_host_ip, myjobs):
  print(">>[training job started in new container]")
  print("[job to run:]")
  print(updated_job)
  job_id = updated_job['_id']

  mc_run_result = mc.run('/casterlyrock/data/' + updated_job['dataset'], updated_job['output_dir'], updated_job['do_delete'], updated_job['max_seq_length'], updated_job['batch_size'], updated_job['learning_rate'], updated_job['num_train_epochs'], updated_job['warmup_proportion'], updated_job['save_checkpoints_steps'], updated_job['save_summary_steps'], updated_job['bert_model_hub'], updated_job['train_test_split'], updated_job['pre_split'], str(updated_job['_id']), master_host_ip)
  print("[result got:]")
  print(mc_run_result)
  print(">>[training job finished in new container, update status to finished]")
  myjobs.update_one({'_id': job_id}, {"$set": {'job_status': 'finished'}})

  return mc_run_result

def put_result_to_db(mc_run_result, dataSaved, predictions_doc, confusion_matrix):
  dataSaved.insert_one(mc_run_result['details'])
  predictions_doc.insert_one(mc_run_result['predictions'])
  confusion_matrix.insert_one(mc_run_result['confusion_matrix'])

def main():

  gpu_index = os.environ['GPU_INDEX']
  host_name = os.environ['HOST_NAME']
  master_host_ip = os.environ['EXTERNAL_IP']

  print(">>[connected to mongodb in new container]")
  client = MongoClient('mongodb://' + master_host_ip + ':27017/')
  print("connected db")

  db = client.myDatabase
  myjobs = db.jobqueue
  dataSaved = db.dataSaved
  predictions_doc = db.predictions_doc
  confusion_matrix = db.confusion_matrix

  print("HOST_NAME: " + host_name + " GPU_INDEX: " + gpu_index)
  current_job =  myjobs.find_one({"$and":[{'gpu_index' : gpu_index}, {'job_status': 'running'}, {'host_name' : host_name}]})
  try:
    mc_run_result = start_new_training(current_job, master_host_ip, myjobs)
  except Exception:
    print(traceback.format_exc())
    print("Exception happened during tf_job run, mark job as failure")
    current_job_id = current_job['_id']
    myjobs.update_one({'_id': current_job_id}, {"$set": {'job_status': 'failure'}})
    exit(1)
  output_dir = mc_run_result['output_dir']
  model_version = mc_run_result['model_version']
  print('****** output_dir: ' + output_dir + ", model_version: " + model_version)
  current_job_id = current_job['_id']
  myjobs.update_one({'_id': current_job_id}, {"$set": {'output_dir': output_dir, 'model_version' : model_version}})

  put_result_to_db(mc_run_result, dataSaved, predictions_doc, confusion_matrix)

  print("copy model file to master host")
  try:
    p = subprocess.Popen(['scp', '-rp', '-o' , 'StrictHostKeyChecking=no', '/scripts/' + output_dir + '/saved_model/' + model_version, 'ynliu@' + master_host_ip + ':/casterlyrock/models/bert_bot_model/'])
    sts = p.wait()
  except Exception:
    print(traceback.format_exc())
    print("Exception happened during copy model, mark job as failure")
    current_job_id = current_job['_id']
    myjobs.update_one({'_id': current_job_id}, {"$set": {'job_status': 'failure'}})
    exit(1)

  print(">>[all job in new container finished, exit]")


main()
