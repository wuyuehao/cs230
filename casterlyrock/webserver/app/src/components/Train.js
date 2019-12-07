import {
  Divider
} from 'antd';

import React, { Component } from 'react';
import TrainForm from './TrainForm'

class Train extends React.Component {

  render() {
      return (
      <div>
      <p><h2>Create Training Job</h2></p>
      <Divider />
      <TrainForm/>
      </div>
    )
  }
}

export default Train
