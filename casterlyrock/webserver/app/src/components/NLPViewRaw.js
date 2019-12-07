import React, { Component } from 'react';

class NLPViewRaw extends Component{
  constructor(props){
    super(props);
    this.state = {
      eval_result: [],
      id: props.match.params.number
    }
  }

  componentDidMount(){
    fetch('/api/nlp/raw?id=' + this.state.id, {
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

            console.log(data['predict_label']);

            this.setState({eval_result : data['predict_label']});
            // this.setState({eval_result_accuracy : data.accuracy});

          });

          }
      );
  }


  render(){
    return(
      <div>
      <div>
      {this.state.eval_result.map((val)=>{
        return <p>{val}</p>
      })}
      </div>
      </div>

    );
  }
}

export default NLPViewRaw;
