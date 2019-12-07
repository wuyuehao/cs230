import { Menu, Icon } from 'antd';
import React, { Component } from 'react';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;




class SiderMenu extends React.Component {
  handleClick = (e) => {
    console.log('click ', e);
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
            <Menu.Item key="2">Incubator Result</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup key="g2" title="Auto ML">
            <Menu.Item key="3">Submit Jobs</Menu.Item>
            <Menu.Item key="4">Tracking</Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="setting" /><span>Tool Box</span></span>}>
          <Menu.Item key="5">Under Construction</Menu.Item>
          <Menu.Item key="6">Under Construction<</Menu.Item>
          <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="7">Under Construction<</Menu.Item>
            <Menu.Item key="8">Under Construction<</Menu.Item>
          </SubMenu>
        </SubMenu>

      </Menu>
    );
  }
}

export default SiderMenu
