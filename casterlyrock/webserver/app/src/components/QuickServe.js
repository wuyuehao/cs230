import React, { Component } from 'react';
import {
  Form, Select, Input, InputNumber, Switch, Radio,
  Slider, Button, Upload, Icon, Rate,Divider, Modal,
  Card, Badge, Table, Tag, message, Steps,Affix, Tabs,
  Layout,Row, Col, DatePicker, TimePicker

} from 'antd';
import { Chart } from "react-charts";
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;


class QuickServe extends Component {
  render() {

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };

    const Option = Select.Option;
    const provinceData = ['Zhejiang', 'Jiangsu'];
    const cityData = {
      Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
      Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
    };

    function handleChange(value) {
      console.log(`selected ${value}`);
    }

    return (
      <Layout className="layout">


      <Form onSubmit={this.handleSubmit}>

      <Select defaultValue="Champion" style={{ width: 120 }} onChange={handleChange}>
      <Option value="ATOR_M1_V1">ATOR_M1_V1</Option>
      <Option value="ATOR_M1_V2">ATOR_M1_V2</Option>
    </Select>
    <Select defaultValue="Challenger" style={{ width: 120 }}>
      <Option value="ATOR_M1_V1">ATOR_M1_V1</Option>
      <Option value="ATOR_M1_V2">ATOR_M1_V2</Option>
    </Select>
    <Select defaultValue="Segment" style={{ width: 120 }}>
      <Option value="ATOR_M1_V1">SEG_1</Option>
      <Option value="ATOR_M1_V2">SEG_2</Option>
      <Option value="ATOR_M1_V2">SEG_3</Option>
    </Select>
       <FormItem
         {...formItemLayout}
         label="Time Range"
       >
         {getFieldDecorator('range-time-picker', rangeConfig)(
           <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
         )}
       </FormItem>

       </Form>


      <Row type="flex">



      </Row>

      <Row type="flex">
      <Col span={6}>
      <div style={{ height: 200 }}>
      Gain Chart
      <Chart
        data={[
          {
            label: "Champion",
            data: [[0,0],[20, 20], [40, 65], [60, 80], [80, 95], [100, 100]]
          },
          {
            label: "Chanllenge",
            data: [[0,0],[20, 21], [40, 67], [60, 82], [80, 100], [100, 100]]
          }
        ]}
        axes={[
          { primary: true, type: "linear", position: "bottom" },
          { type: "linear", position: "left" }
        ]}
      />
      </div>
      </Col>
      <Col span={6}>
      <div style={{ height: 200 }}>
      Lift Chart
      <Chart
        data={[
          {
            label: "Champion",
            data: [[0, 149], [2, 142], [4, 134], [6, 122], [8, 111],[10,100]]
          },
          {
            label: "Chanllenge",
            data: [[0, 146], [2, 140], [4, 132], [6, 120], [8, 110],[10,100]]
          }
        ]}
        axes={[
          { primary: true, type: "linear", position: "bottom" },
          { type: "linear", position: "left" }
        ]}
      />
      </div>
      </Col>
      <Col span={6}>
      <div style={{ height: 200 }}>
      ROC
      <Chart
        data={[
          {
            label: "Champion",
            data: [[0,0],[20, 90], [40, 95], [60, 96], [80, 99], [100, 100]]
          },
          {
            label: "Chanllenge",
            data: [[0,0],[20, 91], [40, 96], [60, 97], [80, 99], [100, 100]]
          }
        ]}
        axes={[
          { primary: true, type: "linear", position: "bottom" },
          { type: "linear", position: "left" }
        ]}
      />
      </div>
      </Col>
      <Col span={6}>
      <div style={{ height: 200 }}>
      K-S
      <Chart
        data={[
          {
            label: "Champion",
            data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
          },
          {
            label: "Chanllenge",
            data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
          }
        ]}
        axes={[
          { primary: true, type: "linear", position: "bottom" },
          { type: "linear", position: "left" }
        ]}
      />
      </div>
      </Col>
      </Row>

    </Layout>
    );
  }
}
const WrappedForm = Form.create()(QuickServe);


export default WrappedForm
