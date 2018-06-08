import React, { Component } from 'react';
import { Table, Icon, Divider,Button,Radio } from 'antd';
import MyLayout from "./pages/MyLayout";
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const RadioGroup = Radio.Group;

class App extends Component {
  render() {
    return (
      <div className="App">
 
          <Router  >
           <MyLayout/>
         </Router >
   
      </div>
    );
  }
}

export default App;
