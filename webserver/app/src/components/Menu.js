import { Menu, Icon } from 'antd';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Home from './Home'
import Jupyter from './Jupyter'
import Train from './Train'
import Track from './Track'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const routes = [
  {
    path: "/",
    exact: true,
    sidebar: () => <div>home!</div>,
    main: () => <div><Home/></div>
  },
  {
    path: "/jupyter",
    sidebar: () => <div>Jupyter!</div>,
    main: () => <div><Jupyter/></div>
  },
  {
    path: "/train",
    sidebar: () => <div><MenuBar/></div>,
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
  }
];

class MenuBar extends Component {




  handleClick = (e) => {
    console.log('click ', e.key);

    if(e.key == 3){
      
    }
  }

  render() {
    return (
      <Menu
        onClick={this.handleClick}
        style={{ width: 256 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <SubMenu key="sub1" title={<span><Icon type="appstore" /><span>AI Playground</span></span>}>
          <MenuItemGroup key="g1" title="TCS Sandbox">
            <Menu.Item key="1">Upload Model</Menu.Item>
            <Menu.Item key="2">Serving</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup key="g2" title="Auto ML">
            <Menu.Item key="3">Submit Jobs</Menu.Item>
            <Menu.Item key="4">Tracking</Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="setting" /><span>Tool Box</span></span>}>
          <Menu.Item key="5">Under Construction</Menu.Item>
          <Menu.Item key="6">Under Construction</Menu.Item>
          <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="7">Under Construction</Menu.Item>
            <Menu.Item key="8">Under Construction</Menu.Item>
          </SubMenu>
        </SubMenu>

      </Menu>
    );
  }
}

export default MenuBar
