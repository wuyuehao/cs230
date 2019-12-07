import React, { Component } from 'react';
import { Input, Tooltip, Icon, Button } from 'antd';
import firebase from './FirebaseConfig';
import { withRouter } from "react-router";

class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: ''
    };

  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSignUp = async event => {
    event.preventDefault();
    try {
      const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.username, this.state.password);
      this.props.history.push("/");
    } catch (error) {
      alert(error);
    }
  };

  handleSignIn = async event => {
    event.preventDefault();

    try {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.username, this.state.password);
      this.props.history.push("/");
    } catch (error) {
      alert(error);
    }
  };

  handleTextChange = (e) =>{
    if(e.key=== 'Enter'){
      this.handleSignIn(e);
    }
  }

  render(){
    return(
      <div>
      <Input
        name="username"
        placeholder="Enter your email"
        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
        suffix={
          <Tooltip title="Extra information">
            <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
          </Tooltip>
        }
        onChange={this.onChange}
        style={{width: '500px', 'margin-bottom': '20px'}}
	onKeyDown={this.handleTextChange}
      />
      <br/>
      <Input.Password
        name = "password"
        placeholder="input password"
        onChange={this.onChange}
        style={{width: '500px', 'margin-bottom': '20px'}}
	onKeyDown={this.handleTextChange}
	/>
      <br/>
      <Button style= {{'margin-right':'20px'}}onClick={this.handleSignIn}>Sign In</Button>
      <Button onClick={this.handleSignUp}>Sign Up</Button>
      </div>
    );

  }
}

export default withRouter(Login)
