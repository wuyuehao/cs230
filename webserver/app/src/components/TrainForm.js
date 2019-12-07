import {
  Form, Select, Input, InputNumber, Switch, Radio,
  Slider, Button, Upload, Icon, Rate,Divider, Modal, Card
} from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class TrainForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });

    fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.props.form.getFieldsValue())
    })

  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }


  handleInputSelectChange = (value) => {
    console.log(value);
    this.showInputLocal = (value === 'local');
    this.showInputRemote = (value === 'remote');
    this.showInputUpload = (value === 'upload')
    var formData = this.props.form.getFieldsValue();
    console.log(formData);
  }

  handleAlgSelectChange = (value) => {
    console.log(value);
    this.shows2s = (value === 's2s');
    this.showimg = (value === 'img');
    var formData = this.props.form.getFieldsValue();
    console.log(formData);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };



    return (
      <Form onSubmit={this.handleSubmit}>
      <Card title="Input Data" bordered={false}>
        <FormItem
          {...formItemLayout}
          label="InputDataType"
          hasFeedback
        >
          {getFieldDecorator('datatype', {
            rules: [
              { required: true, message: 'Please select an input data type!' },
            ],
          })(
            <Select placeholder="Please select an input data type"
              onChange={this.handleInputSelectChange}
            >
              <Option value="local">Local</Option>
              <Option value="remote">Remote</Option>
              <Option value="upload">Upload</Option>
            </Select>
          )}
        </FormItem>

        {this.showInputLocal &&
          <Card title="Local File System">
          <FormItem
            {...formItemLayout}
            label="InputData"
          >
            {getFieldDecorator('inputURL')(
              <Input placeholder="/workspace/uploaded/images/" />
            )}
          </FormItem>
          </Card>
        }

        {this.showInputRemote &&
          <Card title="Remote URL">
          <FormItem
            {...formItemLayout}
            label="InputData"
          >
            {getFieldDecorator('inputURL')(
              <Input placeholder="/workspace/uploaded/images/" />
            )}
          </FormItem>
          </Card>
        }

        {this.showInputUpload &&
          <Card title="Upload">
            <FormItem
              {...formItemLayout}
              label="Upload"
              extra=""
            >
              {getFieldDecorator('upload', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload name="logo" action="/api/upload" listType="picture">
                  <Button>
                    <Icon type="upload" /> Click to upload
                  </Button>
                </Upload>
              )}
            </FormItem>
          </Card>
        }
        </Card>



    <Card title="Algorithm" bordered={false}>
        <FormItem
          {...formItemLayout}
          label="Algorithm"
          hasFeedback
        >
          {getFieldDecorator('alg', {
            rules: [
              { required: true, message: 'Please select an Algorithm!' },
            ],
          })(
            <Select placeholder="Please select an Algorithm"
            onSelect={this.handleAlgSelectChange} >
              <Option value="s2s">Sequence to Sequence</Option>
              <Option value="img">Image Classification</Option>
              <Option value="1">Linear</Option>
              <Option value="2">K-Means</Option>
              <Option value="3">PCA</Option>
              <Option value="4">LDA</Option>
              <Option value="5">NTM</Option>
              <Option value="6">RandomForest</Option>
              <Option value="7">XGBoost</Option>
              <Option value="8">Object Detection</Option>
              <Option value="9">Binary Classification</Option>
              <Option value="10">Multiple Classification</Option>
              <Option value="11">Sentiment Analysis</Option>
              <Option value="12">Machine Translation</Option>
              <Option value="13">Custom</Option>
            </Select>
          )}
        </FormItem>

        {this.showimg &&
          <Card title="Hyper Parameters">
          <FormItem
            {...formItemLayout}
            label="num_layers"
          >
            {getFieldDecorator('minNumLayers', { initialValue: 3 })(
              <InputNumber  />
            )}
            {getFieldDecorator('maxNumLayers', { initialValue: 5 })(
              <InputNumber  />
            )}
            {getFieldDecorator('numOfLayersStep', { initialValue: 1 })(
              <InputNumber />
            )}
          </FormItem>


          <FormItem
            {...formItemLayout}
            label="learning_rate"
          >
            {getFieldDecorator('minLearningRate', { initialValue: 0.1 })(
              <InputNumber  />
            )}
            {getFieldDecorator('maxLearnRate', { initialValue: 0.1 })(
              <InputNumber  />
            )}
            {getFieldDecorator('learningRateStep', { initialValue: 0.1 })(
              <InputNumber />
            )}
          </FormItem>


          <FormItem
            {...formItemLayout}
            label="batch_size"
          >
            {getFieldDecorator('minBatchSize', { initialValue: 32 })(
              <InputNumber  />
            )}
            {getFieldDecorator('maxBatchSize', { initialValue: 32 })(
              <InputNumber  />
            )}
            {getFieldDecorator('numOfBatchStep', { initialValue: 32 })(
              <InputNumber />
            )}
          </FormItem>


          <FormItem
            {...formItemLayout}
            label="num_training_samples"
          >
            {getFieldDecorator('numOfTrainingSamples', { initialValue: 10000 })(
              <InputNumber  />
            )}
          </FormItem>


          <FormItem
            {...formItemLayout}
            label="num_classes"
          >
            {getFieldDecorator('numOfClasses', { initialValue: 1 })(
              <InputNumber  />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="image_shape"
          >
            {getFieldDecorator('imageShape', { initialValue: '3, 20, 20'})(
              <Input placeholder="3, 20, 20" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="optimizer"
            hasFeedback
          >
            {getFieldDecorator('optimizer', {
              rules: [
                { required: true, message: 'Please select an Optimizer!' },
              ],
            })(
              <Select placeholder="Please select an Optimizer">
                <Option value="sgd">sgd</Option>
                <Option value="adam">adam</Option>
                <Option value="rmsprop">adam</Option>
                <Option value="nag">adam</Option>
              </Select>
            )}
          </FormItem>
          </Card>
        }

        {this.shows2s &&
      <Card title="Hyper Parameters">
          <FormItem
            {...formItemLayout}
            label="num_layers"
          >
            {getFieldDecorator('minNumLayers', { initialValue: 3 })(
              <InputNumber  />
            )}
            {getFieldDecorator('maxNumLayers', { initialValue: 5 })(
              <InputNumber  />
            )}
            {getFieldDecorator('numOfLayersStep', { initialValue: 1 })(
              <InputNumber />
            )}
          </FormItem>


          <FormItem
            {...formItemLayout}
            label="learning_rate"
          >
            {getFieldDecorator('minLearningRate', { initialValue: 0.1 })(
              <InputNumber  />
            )}
            {getFieldDecorator('maxLearnRate', { initialValue: 0.1 })(
              <InputNumber  />
            )}
            {getFieldDecorator('learningRateStep', { initialValue: 0.1 })(
              <InputNumber />
            )}
          </FormItem>


          <FormItem
            {...formItemLayout}
            label="batch_size"
          >
            {getFieldDecorator('minBatchSize', { initialValue: 32 })(
              <InputNumber  />
            )}
            {getFieldDecorator('maxBatchSize', { initialValue: 32 })(
              <InputNumber  />
            )}
            {getFieldDecorator('numOfBatchStep', { initialValue: 32 })(
              <InputNumber />
            )}
          </FormItem>


          <FormItem
            {...formItemLayout}
            label="num_training_samples"
          >
            {getFieldDecorator('numOfTrainingSamples', { initialValue: 10000 })(
              <InputNumber  />
            )}
          </FormItem>


          <FormItem
            {...formItemLayout}
            label="num_classes"
          >
            {getFieldDecorator('numOfClasses', { initialValue: 1 })(
              <InputNumber  />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="image_shape"
          >
            {getFieldDecorator('imageShape', { initialValue: '3, 20, 20'})(
              <Input placeholder="3, 20, 20" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="optimizer"
            hasFeedback
          >
            {getFieldDecorator('optimizer', {
              rules: [
                { required: true, message: 'Please select an Optimizer!' },
              ],
            })(
              <Select placeholder="Please select an Optimizer">
                <Option value="sgd">sgd</Option>
                <Option value="adam">adam</Option>
                <Option value="rmsprop">adam</Option>
                <Option value="nag">adam</Option>
              </Select>
            )}
          </FormItem>
          </Card>
        }

</Card>



<FormItem
  wrapperCol={{ span: 12, offset: 6 }}
>
  <Button type="primary" htmlType="submit">Submit</Button>
</FormItem>

        </Form>

    );
  }
}

const WrappedTrain = Form.create()(TrainForm);

export default WrappedTrain
