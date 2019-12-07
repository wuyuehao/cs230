import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import NLPView from './NLPView'
import NLP from './NLP'

class NLPDisplay extends Component{
  render(){
    return (
      <Switch>
        <Route exact path='/nlp' component={NLP}/>
        <Route path='/nlp/:number' component={NLPView}/>
      </Switch>
    );
  }

}

export default NLPDisplay
