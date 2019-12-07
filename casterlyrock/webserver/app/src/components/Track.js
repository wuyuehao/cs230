import React, { Component} from 'react';
import { Redirect} from 'react-router-dom'

class Track extends Component {
  render() {
    return (
      <div>
        <a href="http://10.176.7.123:5000/" target="_blank">Open MLFlow Tracking</a>
      </div>
    );
  }
}

export default Track
