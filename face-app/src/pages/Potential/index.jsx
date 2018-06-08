 import React, { Component } from 'react';
import { Table,Button,Radio,Row,Col,Select,TimePicker,Modal ,DatePicker,Input} from 'antd';
import PhotoMadal from "../../components/PhotoMadal";
import axios from 'axios';
import  "./mytable.css";
import config from "../../util/config";
import moment from 'moment';
import qs from 'qs';

const Search = Input.Search;
const API = config.api
const format = 'HH:mm';
const RadioGroup = Radio.Group;
const Option = Select.Option;
let mom = moment().format('YYYY-MM-D'); 


class MyTable extends Component {
  state = {
    value: 1,
    rowIndex:0,
    myData : [],
    startTime:"null",
    endTime:"null",
    time:5,
    visible:false,
    defaultTime:'',
    pushObj:''
  }

  getReq=()=>{
    axios.get(`${API.registerEvent}` ,{
      params:{
        startTime:`${this.state.startTime}`,
        endTime:`${this.state.endTime}`
      }
    })
    .then(res => {
      if (!res.data) {
        return;
      }
      let list = res.data.data;
      list.map((item,idx)=>{
        item.key = item.id
        
      })
      this.setState({ myData:list });
    });
  }

  setTime0(time,timeString) {
  
    this.setState({
     startTime:timeString
    })
  
 }
 setTime1(time,timeString) {
 
   this.setState({
     endTime:timeString
    })
    
 
 }
 /* 子组件相关方法 */
 showModal(val,record){
   let obj = {
    user_name :record.name,
    user_phone :record.phone,
    sign_time :record.create_time,
    open_id:record.open_id
   }
   this.setState({
     visible:true,
     defaultTime:record.create_time,
     pushObj:obj
   },()=>{
    this.photoMadal.getReq()
   })
    
 }
  onRef = (ref) => {
    this.photoMadal = ref
  }

 pushReq=(pushObj)=>{
   
   pushObj = {
     ...pushObj,
     ...this.state.pushObj
    }
  const self =this;
  axios({
    method: 'post',
    url: API.save,
    data:pushObj
  })
  .then(function() {
    self.getReq()
  });
}
closeModal=()=>{
  this.setState({
    visible:false
  })
}
 /* 搜索名字 */
 searchName=(name)=>{
  console.log(name);
  axios({
    method: 'post',
    url:`${API.searchPot}`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify({keyword:name}),
  })
  .then(res => {
    console.log(res.data.data);
    let searchList  = res.data.data;
    searchList.map((val,idx)=>{
      val.key = val.id
    })
    
    this.setState({
      myData:searchList
    })
  }); 
}

  render() {
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width:"25%",
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
      width:"25%"
    },{
      title: '报名时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width:"30%"
    },
    {
      title:"进行关联",
      dataIndex:'id',
      key:"id",
      width:"20%",
      render:(events,record)=>{ 
      return (<Button  type='primary' onClick={this.showModal.bind(this,events,record)}>进行关联</Button>)
      }  
    }];
  
    return (
      <div className="App">
    
      <Row type="flex" justify="space-between" className="row_top">
        <Col span={2}><Button type="primary" onClick={()=>this.getReq()}>更新</Button></Col>
        <Col span={4}> 
         <Search
            placeholder="输入姓名搜索"
            enterButton
            onSearch={(value) => this.searchName(value)}
            style={{ width: 200 }}
          />
        </Col>
       <Col span={4} offset={10}>
            
             <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择起始时间"
                onChange={this.setTime0.bind(this)}          
              />
            
        </Col>
        <Col span={4} >
           
             <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择终止时间"
                onChange={this.setTime1.bind(this)}          
              />
        </Col>
      </Row>
      <PhotoMadal
        visible={this.state.visible}
        defaultTime={this.state.defaultTime}
        pushReq={this.pushReq}
        onRef={this.onRef} 
        closeModal={this.closeModal}
      />
       <Table 
       columns={columns} 
       dataSource={this.state.myData} 
       />
     
      </div>
    );
  }
  componentWillMount (){
    this.getReq()
  }
}


export default MyTable;