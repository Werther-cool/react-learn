import React, { Component } from 'react';
import { Table,Button,Radio,Row,Col,Select,TimePicker } from 'antd';
import axios from 'axios';

import config from "../../util/config";
import moment from 'moment';
class RadioCell extends React.Component{
  state = {
    cellRecord: this.props.cellRecord,
    selectIndex:0,
    events:this.props.events,
    value:-1,
    pushObj:''
  }
  getReq = ()=>{
    this.props.getReq()
  }
  radioSelect = (e) => {
    this.setState({ value: e.target.value });

    console.log(e.target.value,this.props.cellRecord);
    let idx = e.target.value;
    let pushObj = this.props.cellRecord.events[idx];
    pushObj.user_name =this.props.cellRecord.name;
    pushObj.user_phone =this.props.cellRecord.phone;
    pushObj.sign_time =this.props.cellRecord.signTime;
   
    this.setState({pushObj});
    
  }
  pushReq=()=>{
    console.log(this.state.pushObj);
    const self =this;
    axios({
      method: 'post',
      url: API.save,
      data: this.state.pushObj
    })
    .then(function() {
      self.getReq()
    });
  }
  render() {
    return (
      <div className="radioList">
      <RadioGroup onChange={(e)=>this.radioSelect(e)} value={this.state.value}>
         {this.props.events.map((val,idx)=>{
          return  <Radio key={val.id} value={idx}><img className="radioimg" src={val.original_face}/></Radio>
         })}  
      </RadioGroup>
        <Button disabled={this.state.value===-1} type='primary' onClick={()=>this.pushReq()}>完成关联</Button>
      </div>
    );
  }
}
/* {
      title: '照片',
      dataIndex: 'events',
      key: 'events',
      width:"75%",
      render:(events,record) => ( 
        <RadioCell
        events={events}
        cellRecord={record}
        getReq={this.getReq}
        />
      )
    } */

export default RadioCell