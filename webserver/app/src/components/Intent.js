import React, { Component } from 'react';
import ChatBot, { Loading } from 'react-simple-chatbot';

class Intent extends Component{
  constructor(props){
    super(props);
    console.log(this.props);
    this.state = {
      loading: true,
      result: ''
    };
  }

  componentWillMount() {
    const self = this;
    const { steps } = this.props;
    const search = steps['2'].message;
    if(this.props.model == 'GDS'){
      fetch('/api/nlp/intent_nlpv2?sentence=' + search, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(
           (response) =>{
            if (response.status !== 200) {
              return('Looks like there was a problem. Status Code: ' +
                response.status);
            }
            // Examine the text in the response
            response.json().then((data)=> {
              console.log(data);
              let tmp = 'I guess you are saying:';
              for (const [key, value] of Object.entries(data)) {
                tmp = tmp.concat('\n' + value + '%');
              }
              self.setState({result: tmp});
              self.setState({loading: false});

            });
            }
        );
    }else{
      fetch('/api/nlp/intent?sentence=' + search + '&model=' + this.props.model, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(
           (response) =>{
            if (response.status !== 200) {
              return('Looks like there was a problem. Status Code: ' +
                response.status);
            }
            // Examine the text in the response
            response.json().then((data)=> {
              console.log(data);
              let tmp = 'I guess you are saying:';
              for (const [key, value] of Object.entries(data)) {
                tmp = tmp.concat('\n' + value + '%');
              }
              self.setState({result: tmp});
              self.setState({loading: false});

            });
            }
        );
    }

  }

  render(){
    return(
      <div style={{'white-space': 'pre-wrap', 'display' : 'flex'}}>

        {this.state.loading ? <Loading /> : this.state.result}

      </div>
    );

  }
}

export default Intent
