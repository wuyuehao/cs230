import {
  Form, Select, InputNumber, Switch, Radio,
  Slider, Button, Upload, Icon, Rate,
} from 'antd';

import React, { Component } from 'react';


const FormItem = Form.Item;

class Seq2SeqForm extends React.Component {

  render() {
      return (
        <FormItem
          {...formItemLayout}
          label="InputNumber"
        >
          {getFieldDecorator('input-number', { initialValue: 3 })(
            <InputNumber min={1} max={10} />
          )}
          <span className="ant-form-text"> machines</span>
        </FormItem>

    )
  }
}

export default Seq2SeqForm
