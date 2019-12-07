import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Redirect } from 'react-router'
import { Layout, Menu, Breadcrumb,Row, Col ,Icon, Avatar, Button} from 'antd';


import Home from './components/Home'
import Jupyter from './components/Jupyter'
import UploadModel from './components/UploadModel'
import QuickServe from './components/QuickServe'
import Train from './components/Train'
import Track from './components/Track'
import NLPDisplay from './components/NLPDisplay'
import Login from './components/Login'
import NLP from './components/NLP'
import NLPView from './components/NLPView'
import NLPViewRaw from './components/NLPViewRaw'

import firebase from './components/FirebaseConfig';
import PropTypes from 'prop-types';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const { Header, Sider ,Content, Footer } = Layout;
const routes = [
  // {
  //   path: "/",
  //   exact: true,
  //   sidebar: () => <div>home!</div>,
  //   main: () => <div><NLP/></div>
  // },
  {
    path: "/jupyter",
    sidebar: () => <div>Jupyter!</div>,
    main: () => <div><Jupyter/></div>
  },
  {
    path: "/upload",
    sidebar: () => <div>Upload</div>,
    main: () => <h2><UploadModel/></h2>
  },
  {
    path: "/serve",
    sidebar: () => <div>Serve</div>,
    main: () => <h2><QuickServe/></h2>
  },
  {
    path: "/train",
    sidebar: () => <div>Train</div>,
    main: () => <h2><Train/></h2>
  },
  {
    path: "/tune",
    sidebar: () => <div>Tune!</div>,
    main: () => <h2>Tune</h2>
  },
  {
    path: "/track",
    sidebar: () => <div>Track!</div>,
    main: () => <h2><Track/></h2>
  },
  {
    path: "/deploy",
    sidebar: () => <div>Deploy!</div>,
    main: () => <h2>Deploy</h2>
  },
  // {
  //   path: "/nlp",
  //   sidebar: () => <div>Deploy!</div>,
  //   main: () => <h2><NLPDisplay/></h2>
  // },
  {
    path: "/login",
    main: () => <h2><Login/></h2>
  },
  // {
  //   path: "/raw/:number",
  //   main: () => <h2><NLPViewRaw/></h2>
  // },
];





class App extends Component {
  constructor(props){
    super(props);
    this.state= { loading: true,
              authenticated: false,
              currentUser: null,
              width: 0,
              height: 0
            };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false
        });
        console.log('currentuser: ' + user.email);
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false
        });
      }
    });
  }

  handleSignOut = async event => {
    try {
      const user = await firebase
        .auth()
        .signOut();
    } catch (error) {
      alert(error);
    }
  }

  contextTypes :{
    router: PropTypes.object
  }

  handleClick = (e) => {
    console.log('click ', e.key);
    //this.context.router.push(e.key);
  }


  render() {
    return (
      <Layout className="layout">
        <Router>
        <Header>
        <h1 ><font style={{'margin-right': this.state.width - 650}} color="white">NLP Rapid Model Factory</font><font color = "white">{this.state.currentUser ? this.state.currentUser.email :<Link to="/login"> <Button style={{'margin-left': '180px'}}type="primary" >Login</Button></Link>}{this.state.currentUser ? <Button style = {{'margin-left': '10px'}}type="primary" onClick={this.handleSignOut}>Sign Out</Button>: ""}</font></h1>
      </Header>

        <Layout style={{ padding: '24px 0', background: '#fff' }}>

      <Row type="flex" justify="top">
          <Col span={4}>
          <Menu
            onClick={this.handleClick}
            style={{ width: 250 }}
            defaultSelectedKeys={['0']}
            defaultOpenKeys={['nlp']}
            mode="inline"
          >

            <SubMenu key="nlp" title={<span><Icon type="setting" /><span>NLP GYM</span></span>}>
              <Menu.Item key="10"><Link to='/'>Model Factory</Link></Menu.Item>
            </SubMenu>

            <SubMenu key="sub1" title={<span><Icon type="appstore" /><span>Incubator Dashboard</span></span>}>

              <Menu.Item key="/upload"><Link to='/upload'>Upload Model</Link></Menu.Item>
              <Menu.Item key="/serve"><Link to='/serve'>Incubator Result</Link></Menu.Item>
              <Menu.Item key="/serve"><Link to='/serve'>Incubator Result</Link></Menu.Item>
              <Menu.Item key="/serve"><Link to='/serve'>Incubator Result</Link></Menu.Item>



          </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>AI Playground</span></span>}>
              <MenuItemGroup key="g2" title="Hyperparamater Search">
                <Menu.Item key="/train"><Link to='/train'>Submit Jobs</Link ></Menu.Item>
                <Menu.Item key="/track"><Link to='/track'>Tracking</Link></Menu.Item>
              </MenuItemGroup>
            </SubMenu>
            <SubMenu key="sub3" title={<span><Icon type="setting" /><span>Tool Box</span></span>}>
              <Menu.Item key="5">Under Construction</Menu.Item>
              <Menu.Item key="6">Under Construction</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="7">Under Construction</Menu.Item>
                <Menu.Item key="8">Under Construction</Menu.Item>
              </SubMenu>
            </SubMenu>

          </Menu>

      </Col>
      <Col span={20}>

          <div style={{ flex: 1, padding: "10px" }}>
          <Route exact path='/' component={NLP} />
          <Route path='/nlp/:number' component={NLPView}/>
          <Route path='/raw/:number' component={NLPViewRaw}/>
            {routes.map((route, index) => (
              // Render more <Route>s with the same paths as
              // above, but different components this time.
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.main}
              />
            ))}
            </div>
        </Col>
        </Row>

        </Layout>
        </Router>


        <Footer style={{ textAlign: 'center' }}>
          Casterly Rock©2018
        </Footer>
      </Layout>
    );
  }
}


export default App;
