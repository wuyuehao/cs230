import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
  Form, Select, Input, InputNumber, Switch, Radio,
  Slider, Button, Upload, Icon, Rate,Divider, Modal,
  Card, Badge, Table, Tag, message, Steps,Affix, Tabs,
  Layout,Row, Col, Statistic, Checkbox, Popover

} from 'antd';

import { Chart } from "react-charts";
import Iframe from 'react-iframe';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import firebase from './FirebaseConfig';
import { ThemeProvider } from 'styled-components';
import ChatBot from 'react-simple-chatbot';
import Intent from './Intent'


const { Column, ColumnGroup } = Table;
const Step = Steps.Step;

const FormItem = Form.Item;

const Dragger = Upload.Dragger;

const TabPane = Tabs.TabPane;

const Option = Select.Option;

const theme = {
  background: '#f5f8fb',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#4295f5',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#4295f5',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
}


class NLP extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eval_result: null,
      eval_result_accuracy : null,
      split_enabled: null,
      xlnet_enabled: null,
      form: {
        MAX_SEQ_LENGTH : 128,
        BATCH_SIZE: 32,
        LEARNING_RATE :2e-5,
        NUM_TRAIN_EPOCHS:5.0,
        WARMUP_PROPORTION:0.1,
        SAVE_CHECKPOINTS_STEPS:500,
        SAVE_SUMMARY_STEPS:100,
        DATA_SPLIT :0.7,
        DATASET: 'split_bot_dataset1',
        BERT_URL: 'https://tfhub.dev/google/bert_uncased_L-12_H-768_A-12/1',
        pre_split : true,
        PREDICT_BATCH_SIZE: 8,
        TRAIN_BATCH_SIZE: 32,
        WARMUP_STEPS: 100,
        SAVE_STEPS: 100,
        TRAIN_STEPS: 1000
      },
      experiments: [],
      job_queue: [],
      datasets: null,
      width: 0,
      height: 0,
      data: [],
      authenticated: false,
      currentUser: '',
      steps: [
        {
          id: '1',
          message: 'Deployed Default Set! Type a message for intent',
          trigger: '2',
        },
        {
          id: '2',
          user: true,
          trigger: '3',
        },
        {
          id:'3',
          component: <Intent model = '1559237901' />,
          // message: this.loadIntent,
          trigger: '2',
          delay: 2,
          asMessage: true
        }
      ],
      opened: false,
      chatbotKey: 1,
      colOptions: {
        batch_size: false,
        bert_model_hub: false,
        container_name: false,
        dataset: false,
        do_delete: false,
        gpu_index: false,
        job_status: false,
        learning_rate: false,
        max_seq_length: false,
        num_train_epochs: false,
        output_dir: false,
        pre_split: false,
        save_checkpoints_steps: false,
        save_summary_steps: false,
        train_test_split: false,
        user_email: false,
        warmup_proportion: false
      },
      columnOptions: ['Job', 'Status', 'Dataset', 'Model', 'View Options'],
      currentModel: ''
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

  }

  componentDidMount(){
    this.loadDataSet();
    this.updateWindowDimensions();
    this.loadExperiments();
    window.addEventListener('resize', this.updateWindowDimensions);

    this.autoRefreshTable();
    this.forceUpdate();
  }

  componentWillUnmount(){
    clearInterval(this.interval);

  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user.email
        });
        this.loadJobQueue();
      } else {
        this.setState({
          authenticated: false,
          currentUser: ''
        });
      }
    });
  }

  loadDataSet(){
    fetch('/api/nlp/datasets', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(
         (response) =>{
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
          // Examine the text in the response
          response.json().then((data)=> {
            console.log(data);
            this.setState({datasets : data});
            this.state.form['DATASET'] = data[0];
            console.log(this.state.form);
          });

        }
      );
  }

  loadJobQueue(){
    fetch('/api/nlp/jobqueue?user_email=' + this.state.currentUser, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(
         (response) =>{
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
          // Examine the text in the response
          response.json().then((data)=> {
            console.log(data);
            this.setState({job_queue : data});
            this.setState({data: this.state.job_queue.map(function(job){

                let tmp = {id: job['_id']['$oid'], status: job['job_status'], dataset: job['dataset'], othercol:'test', batch_size: job['batch_size'], bert_model_hub: job['bert_model_hub'], container_name: job['container_name'], do_delete: job['do_delete'] ? 'true' : 'false', gpu_index: job['gpu_index'], learning_rate: job['learning_rate'], max_seq_length: job['max_seq_length'], num_train_epochs: job['num_train_epochs'], output_dir: job['output_dir'], pre_split: job['pre_split'] ? 'true' : 'false', save_checkpoints_steps: job['save_checkpoints_steps'], save_summary_steps: job['save_summary_steps'], train_test_split: job['train_test_split'], user_email: job['user_email'], warmup_proportion: job['warmup_proportion'], model_version: job['model_version']};
                if(job['bert_model_hub']=='https://tfhub.dev/google/bert_uncased_L-12_H-768_A-12/1'){
                  tmp['model'] = 'bert_base';
                }else if(job['bert_model_hub']=='https://tfhub.dev/google/bert_uncased_L-24_H-1024_A-16/1'){
                  tmp['model'] = 'bert_large';
                }else if(job['bert_model_hub']=='https://tfhub.dev/google/bert_multi_cased_L-12_H-768_A-12/1'){
                  tmp['model'] = 'bert_multi_cased';
                }
		else if(job['bert_model_hub'] == 'xlnet_base_url'){
                  tmp['model'] = 'xlnet_base';
                }else{
                  tmp['model'] = 'xlnet_large';
                }
                return tmp;
              })
            });

          });

          }
      );
  }

  loadExperiments(){
    fetch('/api/nlp/experiments', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(
         (response) =>{
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
          // Examine the text in the response
          response.json().then((data)=> {
            console.log(data);
            this.setState({experiments: data});


          });

          }
      );
  }

  autoRefreshTable(){
    this.interval = setInterval(() => {
      this.loadJobQueue();
      console.log("call job queue");
    }, 10000);
  }

  updateWindowDimensions(){
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  onChange = (info) => {
    this.setState({ loading: false });

    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      this.response = info.file.response;
      this.loadDataSet();
      console.log(this.response);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      this.response = info.file.response;
      console.log(this.response);
    }

  }

  normFile = (e) => {

    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  startTraining = (e) => {
    if (this.state.currentUser == ''){
      alert("Please Login to Submit Job!");
    }else{
      console.log(`started training`);
      console.log(JSON.stringify(this.state.form))
      const tmp = this.state.form;
      tmp['user_email'] = this.state.currentUser;
      fetch('/api/nlp/submit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tmp)
      }).then(

           (response) =>{
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status);

              return;
            }
            this.loadJobQueue();
            // Examine the text in the response
            response.json().then((data)=> {

              console.log(data);
              this.setState({eval_result : data.details});
              this.setState({eval_result_accuracy : data.accuracy});

            });

            }
      );
    }
  }

  _handleChangeEvent(e) {
        console.log(e)
        console.log(e.target);
        this.state.form[e.target.id] = parseFloat(e.target.value);
  }

  _handleSelectDatasetEvent(value) {
        console.log(value)
        if (value.startsWith('split_')){
            console.log("hide")
            this.state.form.pre_split = true;
            this.setState({ split_enabled: false});
        }
        else{
            console.log("show")
            this.state.form.pre_split = false;
            this.setState({ split_enabled: true});
        }

        this.state.form.DATASET = value;
  }

  _handleSelectBaseModelEvent(value) {
        console.log(value)
        this.state.form.BERT_URL = value;
        if(value.startsWith('xlnet')){
          this.setState({xlnet_enabled: value});
        }else{
          this.setState({xlnet_enabled: null});
        }
  }

  _isPreSplit(value){
      console.log(value)
       this.state.form.pre_split = value;
  }

  clickedView(value){

    console.log('callings');
    console.log(value);
  }

  clickedTracking(dataset){
    this.loadExperiments();
    dataset = "-tmp-data-" + dataset;
    var current_url = window.location.href;
    var current_host = current_url.split("//")[1].split(":")[0];
    window.open('http://' + current_host + ':5000');
  }

  clickedDelete(id){
    fetch('/api/nlp/clearqueue?id=' + id , {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(
         (response) =>{
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
          // Examine the text in the response
          response.json().then((data)=> {
            console.log(data);
            this.loadJobQueue();
          });

          }
      );
  }

  clickedTry(dataset, model){
    console.log(model);
    console.log(model['_original']);
    console.log(model['_original']['model_version']);
    this.setState({currentModel: model['_original']['model_version'] });

    let modelName = ""
    if(model['_original']['bert_model_hub'].startsWith('http')){
      modelName = "BERT";
    }else{
      modelName = "Xlnet";
    }
    this.setState({steps:
      [
        {
          id: '1',
          message: 'Model: '+ modelName+  ' Version: ' + model['_original']['model_version'] + ' deployed, how can I help you?',
          trigger: '2',
        },
        {
          id: '2',
          user: true,
          trigger: '3',
        },
        {
          id:'3',
          component: <Intent model = {model['_original']['model_version']} />,
          // message: this.loadIntent,
          trigger: '2',
          delay: 2,
          asMessage: true
        }
      ]
    });
    this.setState({chatbotKey: Math.floor(Math.random() * 10000)});
    this.setState({opened: true});
  }

  clickedGDSBot = () => {
    this.setState({steps:
      [
        {
          id: '1',
          message: 'Model: GDS ChatBot deployed, how can I help you?',
          trigger: '2',
        },
        {
          id: '2',
          user: true,
          trigger: '3',
        },
        {
          id:'3',
          component: <Intent model = 'GDS' />,
          // message: this.loadIntent,
          trigger: '2',
          delay: 2,
          asMessage: true
        }
      ]
    });
    this.setState({chatbotKey: Math.floor(Math.random() * 10000)});
    this.setState({opened: true});
  }

  toggleFloating = ({ opened }) => {
    this.setState({ opened });
  }

  handleJobQueueChange(value){
    this.setState({columnOptions: value});
  };

  parseColumns(columns){
    let newCol = []
    for(let i = 0; i < columns.length; i++){
      if(this.state.columnOptions.includes(columns[i]['Header'])){
        newCol.push(columns[i]);
      }
    }
    return newCol;

  };

  render() {

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    let columns = [
      {
          Header: 'Job',
          accessor: 'id', // String-based value accessors!
          width: this.state.width * .1
        }, {
          Header: 'Status',
          accessor: 'status',
          minWidth: this.state.width * .05,
          Cell: (result) => (
            <div style={{color: result.row.status == 'finished' ? 'blue' : result.row.status == 'running' ? 'green' : result.row.status == 'failure' ? 'red' :'orange'}}>{result.row.status}</div>
          )

        }, {
          Header: 'Dataset',
          accessor: 'dataset',
          minWidth: this.state.width * .1
        },
	{
          Header: 'Model',
          accessor: 'model',
          minWidth: this.state.width * .05
        },
	{
          Header: 'View Options',
          accessor: 'othercol',
          Cell: (result) => (<div><Button><Link to={'/nlp/' + result.row.id}>View<Icon type = "zoom-in"/></Link></Button>
                                  <Button onClick={this.clickedTracking.bind(this,result.row.dataset)}>MLFlow<Icon type = "line-chart"/></Button>
                                  <Button onClick={this.clickedTry.bind(this,result.row.dataset, result.row)}>Try<Icon type = "enter"/></Button>
                                  <Button disabled>Deploy<Icon type = "deployment-unit"/></Button>
                                  <Button><Link to={'/raw/' + result.row.id}>Raw</Link></Button>
                                  <Button onClick={this.clickedDelete.bind(this,result.row.id)}>Delete<Icon type = "delete"/></Button>
                            </div>),
          width: this.state.width * .35
        },
        {
          Header: 'Batch Size',
          accessor: 'batch_size',
          minWidth: this.state.width * .05
        },
        {
          Header: 'Bert Model Hub',
          accessor: 'bert_model_hub',
          minWidth: this.state.width * .1
        },
        {
          Header: 'Container Name',
          accessor: 'container_name',
          minWidth: this.state.width * .05
        },
        {
          Header: 'Do Delete',
          accessor: 'do_delete',
          minWidth: this.state.width * .05
        },
        {
          Header: 'GPU Index',
          accessor: 'gpu_index',
          minWidth: this.state.width * .05
        },
        {
          Header: 'Learning Rate',
          accessor: 'learning_rate',
          minWidth: this.state.width * .05
        },
        {
          Header: 'Max Sequence Length',
          accessor: 'max_seq_length',
          minWidth: this.state.width * .05
        },
        {
          Header: 'Num Train Epochs',
          accessor: 'num_train_epochs',
          minWidth: this.state.width * .05
        },
        {
          Header: 'Output Dir',
          accessor: 'output_dir',
          minWidth: this.state.width * .05
        },
        {
          Header: 'Pre Split',
          accessor: 'pre_split',
          minWidth: this.state.width * .05
        },
        {
          Header: 'Save Checkpoints Steps',
          accessor: 'save_checkpoints_steps',
          minWidth: this.state.width * .05
        },
        {
          Header: 'Save Summary Steps',
          accessor: 'save_summary_steps',
          minWidth: this.state.width * .05
        },
        {
          Header: 'Train Test Split',
          accessor: 'train_test_split',
          minWidth: this.state.width * .05
        },
        {
          Header: 'User Email',
          accessor: 'user_email',
          minWidth: this.state.width * .05
        },
        {
          Header: 'Warmup Proportion',
          accessor: 'warmup_proportion',
          minWidth: this.state.width * .05
        },
        {
          Header: 'Model Number',
          accessor: 'model_version',
          minWidth: this.state.width * .10
        },
    ]
    return (


<Layout className="layout">
<Row type="flex" justify="top">

<Col span={12}>
<Card title="Dataset" >

<Col span={20}>
<Card
          type="inner"
          title="Dataset"
        >
        <Row type="flex" justify="top">
        <Col span={14}>
        Dataset:
        <Popover
                    title="How to format data"

                    content={<div style={{'display' : 'inline-block', 'width': '1300px'}}>
                      <div >
                      <p style={{"color" : "blue"}}>Please format data into 4 files(use same name as here): train.csv, train_label.csv, test.csv, test_label.csv</p>
                      </div>

                      <div style = {{'float': 'left'}}>
                        <p style={{"color" : "green"}}>train.csv (contains train data):</p>
                        <p>good morning sir</p>
                        <p>I want to check my refund status</p>
                        <p>I really hate the new interface design</p>
                      </div>

                      <div style = {{'float': 'left', 'margin-left' : '30px'}}>
                      <p style={{"color" : "green"}}>train_label.csv (contains train labels):</p>
                      <p>hello</p>
                      <p>refundstatus</p>
                      <p>negfdbk</p>
                      </div>

                      <div style = {{'float': 'left', 'margin-left' : '30px'}}>
                      <p style={{"color" : "green"}}>test.csv (contains test data):</p>
                      <p>I want my money back</p>
                      <p>how do i make this chat box go away</p>
                      <p>I didn't got my refund yet!</p>
                      </div>

                      <div style = {{'float': 'left', 'margin-left' : '30px'}}>
                      <p style={{"color" : "green"}}>test_label.csv (contains test labels):</p>
                      <p>refundstatus</p>
                      <p>txnacctcasedetails</p>
                      <p>negfdbk</p>
                      </div>

                    </div>}
                    >

            <Icon type="info-circle" />
        </Popover>

          {
            // will not load properly when there are zero datasets


            this.state.datasets ?
            <div>
              <Select
                 key="different_select"
                 style={{ width: '100%' }}
                 placeholder="Select a dataset"
                 id='DATASET'
                 defaultValue={this.state.datasets[0]}
                 onChange={(e)=>{this._handleSelectDatasetEvent(e);}}
               >
               {
                 this.state.datasets &&
                 this.state.datasets.map(function(dataset, index){
                   return <Option value = {this.state.datasets[index]}>{this.state.datasets[index]}</Option>
                 }, this)
               }
               </Select>
             </div>
             :
             <div>
               <Select
                  style={{ width: '100%' }}
                  placeholder="Select a dataset"
                  id='DATASET'
                  defaultValue={''}
                  onChange={(e)=>{this._handleSelectDatasetEvent(e);}}
                >
                {
                  this.state.datasets &&
                  this.state.datasets.map(function(dataset, index){
                    return <Option value = {this.state.datasets[index]}>{this.state.datasets[index]}</Option>
                  }, this)
                }
                </Select>
              </div>
          }


         </Col>
         <Col span={6}>
         {  this.state.split_enabled &&
            <div>Split: <Input id='DATA_SPLIT' defaultValue={this.state.form['DATA_SPLIT']} onChange={(e)=>{this._handleChangeEvent(e);}}/></div>
         }
         </Col>
         <Col span={4}>
         </Col>
         </Row>
        </Card>
</Col>




<Col span={4}>

        <FormItem>
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
            onChange: this.onChange
          })(
            <Dragger name="datasets.zip" action="/api/upload" listType="zip_safe">
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Upload</p>
                <p className="ant-upload-hint">

                </p>
              </Dragger>
          )}
        </FormItem>

</Col>
</Card>
</Col>


<Col span={12} style={{height: '260px'}}>
<Card title="Configuration" >
<Row style={{height: '202px'}}>
{
  this.state.xlnet_enabled ?
  <div>
  <Col span={12}>
    <table>
    <tr>
    <td>BASE_MODEL</td>
    <td>
    <Select
       style={{ width: 150 }}
       placeholder="Select a base model"
       id='BERT_URL'
       defaultValue={this.state.form['BERT_URL']}
       onChange={(e)=>{this._handleSelectBaseModelEvent(e);}}
       style={{ width: '74%' }}
     >
       {/*<Option value="https://tfhub.dev/google/bert_uncased_L-12_H-768_A-12/1">bert_base</Option>
       <Option value="https://tfhub.dev/google/bert_uncased_L-24_H-1024_A-16/1">bert_large</Option>
       <Option value="xlnet_base_url">xlnet_base</Option>
       <Option value="xlnet_large_url">xlnet_large</Option>*/}
       <Option value="https://tfhub.dev/google/bert_uncased_L-12_H-768_A-12/1">bert_base</Option>
       <Option value="https://tfhub.dev/google/bert_uncased_L-24_H-1024_A-16/1">bert_large</Option>
       <Option value="https://tfhub.dev/google/bert_multi_cased_L-12_H-768_A-12/1">bert_multi_cased</Option>
       <Option value="xlnet_base_url">xlnet_base</Option>
       <Option value="xlnet_large_url">xlnet_large</Option>
     </Select>
     </td>
    </tr>
    <tr>
    <td>MAX_SEQ_LENGTH</td>
    <td><Input id='MAX_SEQ_LENGTH' defaultValue={this.state.form['MAX_SEQ_LENGTH']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
    </tr>
    <tr>
    <td>TRAIN_BATCH_SIZE</td>
    <td><Input key= 'TRAIN_BATCH_SIZE' id='TRAIN_BATCH_SIZE' defaultValue={this.state.form['TRAIN_BATCH_SIZE']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
    </tr>
    <tr>
    <td>PREDICT_BATCH_SIZE</td>
    <td><Input key= 'PREDICT_BATCH_SIZE' id='PREDICT_BATCH_SIZE' defaultValue={this.state.form['PREDICT_BATCH_SIZE']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
    </tr>
    </table>
    </Col>
    <Col span={12}>
    <table>
    <tr>
    <td>TRAIN_STEPS</td>
    <td><Input key='TRAIN_STEPS' id='TRAIN_STEPS' defaultValue={this.state.form['TRAIN_STEPS']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
    </tr>
    <tr>
    <td>LEARNING_RATE</td>
    <td><Input key='LEARNING_RATE' id='LEARNING_RATE' defaultValue={this.state.form['LEARNING_RATE']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
    </tr>
    <tr>
      <td>EXISTING_MODEL</td>
      <td><Input id='EXISTING_MODEL' defaultValue='NA' onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
    </tr>
    <tr>
    <td>SAVE_STEPS</td>
    <td><Input key='SAVE_STEPS' id='SAVE_STEPS' defaultValue={this.state.form['SAVE_STEPS']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
    </tr>
    <tr>
    <td>WARMUP_STEPS</td>
    <td><Input key='WARMUP_STEPS' id='WARMUP_STEPS' defaultValue={this.state.form['WARMUP_STEPS']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
    </tr>
    </table>
    </Col>
    </div>
    :
    <div>
    <Col span={12}>
      <table>
      <tr>
      <td>BASE_MODEL</td>
      <td>
      <Select
         style={{ width: 150 }}
         placeholder="Select a base model"
         id='BERT_URL'
         defaultValue={this.state.form['BERT_URL']}
         onChange={(e)=>{this._handleSelectBaseModelEvent(e);}}
         style={{ width: '74%' }}
       >
       <Option value="https://tfhub.dev/google/bert_uncased_L-12_H-768_A-12/1">bert_base</Option>
       <Option value="https://tfhub.dev/google/bert_uncased_L-24_H-1024_A-16/1">bert_large</Option>
       <Option value="https://tfhub.dev/google/bert_multi_cased_L-12_H-768_A-12/1">bert_multi_cased</Option>
       <Option value="xlnet_base_url">xlnet_base</Option>
       <Option value="xlnet_large_url">xlnet_large</Option>
       </Select>
       </td>
      </tr>
      <tr>
      <td>MAX_SEQ_LENGTH</td>
      <td><Input id='MAX_SEQ_LENGTH' defaultValue={this.state.form['MAX_SEQ_LENGTH']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
      </tr>
      <tr>
      <td>BATCH_SIZE</td>
      <td><Input id='BATCH_SIZE' defaultValue={this.state.form['BATCH_SIZE']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
      </tr>
      <tr>
      <td>LEARNING_RATE</td>
      <td><Input id='LEARNING_RATE' defaultValue={this.state.form['LEARNING_RATE']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
      </tr>
      <tr>
      <td>EXISTING_MODEL</td>
      <td><Input id='EXISTING_MODEL' defaultValue='NA' onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
      </tr>
      </table>
      </Col>
      <Col span={12}>
      <table>
      <tr>
      <td>NUM_TRAIN_EPOCHS</td>
      <td><Input id='NUM_TRAIN_EPOCHS' defaultValue={this.state.form['NUM_TRAIN_EPOCHS']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
      </tr>
      <tr>
      <td>WARMUP_PROPORTION</td>
      <td><Input id='WARMUP_PROPORTION' defaultValue={this.state.form['WARMUP_PROPORTION']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
      </tr>
      <tr>
      <td>SAVE_CHECKPOINTS_STEPS</td>
      <td><Input id='SAVE_CHECKPOINTS_STEPS' defaultValue={this.state.form['SAVE_CHECKPOINTS_STEPS']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
      </tr>
      <tr>
      <td>SAVE_SUMMARY_STEPS</td>
      <td><Input id='SAVE_SUMMARY_STEPS' defaultValue={this.state.form['SAVE_SUMMARY_STEPS']} onChange={(e)=>{this._handleChangeEvent(e);}} style={{ width: '74%' }}/></td>
      </tr>
      </table>
      </Col>
      </div>

}

</Row>
</Card>

</Col>
</Row>



<Card title="Model Training">
<Row type="flex" justify="top">
<Col span={6}>
<Button type="primary" onClick={this.startTraining}>
        Start Training
        <Icon type="right" />
      </Button>
</Col>
<Col span={18}>

<Steps>
    <Step status="finish" title="Submit Job" icon={<Icon type="user" />} />
    <Step status="finish" title="Validate Dataset" icon={<Icon type="solution" />} />
    <Step status="finish" title="Training" icon={<Icon type="database" />} />
    <Step status="finish" title="Evaluate" icon={<Icon type="smile-o" />} />
    <Step status="finish" title="Finish" icon={<Icon type="smile-o" />} />
  </Steps>

</Col>
</Row>
</Card>






<Card title = "Job Queue">
<Row type="flex" justify="top" >
<p>Select Columns for Table:  </p>
</Row>
<Row type="flex" justify="top" >
<Select
    mode="multiple"
    placeholder="Please select other attributes"
    onChange={(e) => this.handleJobQueueChange(e)}
    defaultValue={['Job', 'Status', 'Dataset','Model', 'View Options']}
    style={{'margin-bottom' : '20px'}}
  >
  {columns.map((col) => {
    return <Option key = {col['Header']}> {col['Header']} </Option>
  })}
  </Select>
</Row>
<Row type="flex" justify="top" >

<Col>
<ReactTable
data = {this.state.data}
columns = {this.parseColumns(columns)}
minRows= {10}
reziable={true}/>
</Col>
</Row>
</Card>


<Card title='PayPal GDS Model'>
<Row>
<Col>
<Button onClick={this.clickedGDSBot}>Try PayPal GDS Model</Button>
</Col>
</Row>
</Card>

<ThemeProvider theme={theme}>
<ChatBot
    key={this.state.chatbotKey}
    steps={this.state.steps}
    floating={true}
    opened={this.state.opened}
    toggleFloating={this.toggleFloating}
/>
</ThemeProvider>
{/*<Card title = "Chat Bot">
<Row type="flex" justify="top" >
<Col>

</Col>
</Row>
</Card>*/}



{/*<Row type="flex">

<Col span={24}>


<Card title="Predict" >
<Row type="flex" justify="top">


<Col span={9}>
<Card title="Choose a model">
<Select style={{ width:  '100%' }}
   showSearch
   placeholder="Select a model"
   optionFilterProp="base_model"

 >
   <Option value="bertbase">model-11</Option>
   <Option value="bertlarge">model-12</Option>
 </Select>
<Input style={{ width: '100%' }} defaultValue="" />
<Input style={{ width: '100%' }} defaultValue="" />
<Input style={{ width: '100%' }} defaultValue="" />
<Input style={{ width: '100%' }} defaultValue="" />
<Input style={{ width: '100%' }} defaultValue="" />
</Card>

</Col>
<Col span={6}>
<Button type="primary">
   Submit
   <Icon type="right" />
      </Button>
</Col>

<Col span={9}>

</Col>
</Row>
</Card>



</Col>
</Row>




<Row>
<Iframe url="http://localhost:5000/#/"
          width="1380px"
          height="800px"
          />
</Row>*/}
</Layout>


    );
  }
}

const data_c1 = [
{
label: "Series 1",
data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
},
{
label: "Series 2",
data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
},
{
label: "Series 3",
data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
}
];

const columns = [{
  title: 'Class',
  dataIndex: 'id',
}, {
  title: 'Samples',
  dataIndex: 'rscore',
}];
const data = [{
  id: 'General_Connect_to_Agent',
  rscore: 457,
}, {
  id: 'refundstatus',
  rscore: 940,
}, {
  id: 'hello',
  rscore: 125,
},{
  id: 'General_Negative_Feedback',
  rscore: 131,
}]
const test_data = [{
  id: 'General_Connect_to_Agent',
  rscore: 146,
}, {
  id: 'refundstatus',
  rscore: 312,
}, {
  id: 'hello',
  rscore: 42,
},{
  id: 'General_Negative_Feedback',
  rscore: 52,
}]

const eval_columns = [
  {
  title: 'Actual/Predict',
  dataIndex: 'id',
},{
  title: 'Actual True',
  dataIndex: 'num1',
}, {
  title: 'Actual False',
  dataIndex: 'num2',
}];

const cmatrix_data = [{
  id: 'Predict True',
  num1: 'TP = 457',
  num2: 'FP = 20',
}, {
  id: 'Predict False',
  num1: 'FN = 940',
  num2: 'TN = 20',
}]

const WrappedForm = Form.create()(NLP);


export default WrappedForm
