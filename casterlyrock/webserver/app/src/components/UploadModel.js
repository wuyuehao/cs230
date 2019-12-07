import React, { Component } from 'react';
import {
  Form, Select, Input, InputNumber, Switch, Radio,
  Slider, Button, Upload, Icon, Rate,Divider, Modal,
  Card, Badge, Table, Tag, message, Steps,Affix, Tabs,
  Layout,Row, Col

} from 'antd';

import { StickyContainer, Sticky } from 'react-sticky';
import { Chart } from "react-charts";

const { Column, ColumnGroup } = Table;
const Step = Steps.Step;

const FormItem = Form.Item;

const Dragger = Upload.Dragger;

const TabPane = Tabs.TabPane;


const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />
    )}
  </Sticky>
);

class UploadModel extends Component {
  state = {
      loading: true,
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

  render() {

    const { loading } = this.state;

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (


<Layout className="layout">
<Row type="flex" justify="top">
<Col span={16}>
<Form onSubmit={this.handleSubmit}>
<Card title="Upload Model" style={{ height: 400 }}>
        <FormItem>
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
            onChange: this.onChange
          })(
            <Dragger name="model.zip" action="/api/v1/upload" listType="zip_safe">
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                <Card
                  type="inner"
                  title="Model Format Requirements"
                  extra={<a href="#">More</a>}
                >

                </Card>
                </p>
              </Dragger>
          )}
        </FormItem>
</Card>
</Form>
</Col>

<Col span={8}>
<Card title="Progress" loading={loading} style={{ height: 400 }}>
{this.response &&
<Steps direction="vertical" size="small">
  <Step status="finish" title="Upload" icon={<Icon type="user" />} />
  <Step status="finish" title="Validation" icon={<Icon type="solution" />} />
  <Step status="finish" title="Optimization" icon={<Icon type="fork" />} />
  <Step status="finish" title="Verification" icon={<Icon type="safety" />} />
  <Step status="process" title="Running LnP" icon={<Icon type="loading" />} />
  <Step status="wait" title="Go Incubator" icon={<Icon type="cloud" />} />
  <Step status="wait" title="Live-Auditing" icon={<Icon type="area-chart" />} />
</Steps>
}
</Card>

</Col>
</Row>

<Row type="flex">

<Col span={24}>

<Card title="Model Status" loading={loading}>

    <Tabs defaultActiveKey="1" renderTabBar={renderTabBar}>
      <TabPane tab="Model Stats" key="1">
              {this.response && this.response.serving_default &&
              <Card>
              <Badge status="success" text="Input Tensors" />
              <br/>
                <Table dataSource={this.response.serving_default.inputs}>
                    <Column
                      title="Name"
                      dataIndex="name"
                      key="name"
                    />
                    <Column
                      title="Key"
                      dataIndex="key"
                      key="key"
                    />
                    <Column
                      title="Dtype"
                      dataIndex="dtype"
                      key="dtype"
                    />
                    <Column
                      title="Dims"
                      dataIndex="dims"
                      key="dims"
                      render={dims => (
                        <span>
                          {dims.map(dim => <Tag color="blue" key={dim}>{dim}</Tag>)}
                        </span>
                      )}
                    />
                </Table>
                <Badge status="success" text="Output Tensors" />
                <br/>
                <Table dataSource={this.response.serving_default.outputs}>
                    <Column
                      title="Name"
                      dataIndex="name"
                      key="name"
                    />
                    <Column
                      title="Key"
                      dataIndex="key"
                      key="key"
                    />
                    <Column
                      title="Dtype"
                      dataIndex="dtype"
                      key="dtype"
                    />
                    <Column
                      title="Dims"
                      dataIndex="dims"
                      key="dims"
                      render={dims => (
                        <span>
                          {dims.map(dim => <Tag color="blue" key={dim}>{dim}</Tag>)}
                        </span>
                      )}
                    />
                </Table>
              </Card>
              }




      </TabPane>
      <TabPane tab="Verification" key="2" >

      <div>
        <h4>Validation Samples</h4>
        <Table columns={columns} dataSource={data} size="small" />
      </div>

      </TabPane>
      <TabPane tab="Latency" key="3" style={{ height: 200 }}>

      <Chart
        data={[
          {
            label: "Champion",
            data: [[0, 20], [1, 21], [2, 25], [3, 23], [4, 22]]
          },
          {
            label: "Challenger",
            data: [[0, 21], [1, 22], [2, 26], [3, 21], [4, 21]]
          }
        ]}
        axes={[
          { primary: true, type: "linear", position: "bottom" },
          { type: "linear", position: "left" }
        ]}
      />

      </TabPane>
      <TabPane tab="Throughput" key="4" style={{ height: 200 }}>

      <Chart
        data={[
          {
            label: "Champion",
            data: [[0, 800], [1, 780], [2, 800], [3, 820], [4, 800]]
          },
          {
            label: "Challenger",
            data: [[0, 900], [1, 980], [2, 900], [3, 920], [4, 900]]
          }
        ]}
        axes={[
          { primary: true, type: "linear", position: "bottom" },
          { type: "linear", position: "left" }
        ]}
      /></TabPane>
      <TabPane tab="CPU Utilization" key="5" style={{ height: 200 }}>

      <Chart
        data={[
          {
            label: "Champion",
            data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
          },
          {
            label: "Challenger",
            data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
          }
        ]}
        axes={[
          { primary: true, type: "linear", position: "bottom" },
          { type: "linear", position: "left" }
        ]}
      /></TabPane>
      <TabPane tab="GPU Utilization" key="6" style={{ height: 200 }}>

      <Chart
        data={[
          {
            label: "Champion",
            data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
          },
          {
            label: "Challenger",
            data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
          }
        ]}
        axes={[
          { primary: true, type: "linear", position: "bottom" },
          { type: "linear", position: "left" }
        ]}
      /></TabPane>
    </Tabs>
</Card>
    </Col>
</Row>
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
  title: 'Sample Id',
  dataIndex: 'id',
}, {
  title: 'Result Score',
  dataIndex: 'rscore',
}, {
  title: 'Expected Score',
  dataIndex: 'escore',
}];
const data = [{
  id: '2204405',
  rscore: 0.24208838,
  escore: 0.2420881688594818,
}, {
  id: '2204406',
  rscore: 0.24208838,
  escore: 0.2420881688594818,
}, {
  id: '2204407',
  rscore: 0.24208838,
  escore: 0.2420881688594818,
},{
  id: '2204405',
  rscore: 0.24208838,
  escore: 0.2420881688594818,
}]

const WrappedForm = Form.create()(UploadModel);


export default WrappedForm
