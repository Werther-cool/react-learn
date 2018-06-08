import React, { Component } from 'react'; 
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import  './myLayout.css';
import Potential from "./Potential";
import Mathced from "./Mached"
import Home from "./Home";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class MyLayout extends  React.Component {
  state={
    defaultKey:1
  }
  selectMenu=(val)=>{
    console.log(val.key);
    this.setState({
      defaultKey:val.key
    })
  }
  render(){
    return (
      <Layout>
   
      <Header className="header">
        <div className="logo" >
          云徙科技
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: '64px' }}
          defaultSelectedKeys={["1"]}
          // selectedKeys={[`${this.state.defaultKey}`]}
          // onClick ={(val)=>this.selectMenu(val)}
        >
          {/* <Menu.Item key="1">匹配</Menu.Item> */}
          <Menu.Item key="1"><Link to="/">访客</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/potential">潜客</Link></Menu.Item> 
          <Menu.Item key="3"><Link to="/mached">会员</Link></Menu.Item> 
        </Menu>
      </Header>
      <Layout>
        {/* <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
              <Menu.Item key="5">option5</Menu.Item>
              <Menu.Item key="6">option6</Menu.Item>
              <Menu.Item key="7">option7</Menu.Item>
              <Menu.Item key="8">option8</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider> */}
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {/* <Breadcrumb.Item>匹配</Breadcrumb.Item> */}
            {/* <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item> */}
          </Breadcrumb>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 880 }}>
            
            <Route exact path="/" component={Home}/>
            <Route  path="/potential" component={Potential}/>
            <Route  path="/mached" component={Mathced}/>
         
          </Content>
        </Layout>
      </Layout>
   
    </Layout>
    )
  }

  componentWillMount (){
    
  }
}

export default MyLayout;

