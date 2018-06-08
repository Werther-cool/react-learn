import React, { Component } from 'react';
import { Table,Button,Radio,Row,Col,Select,Icon,TimePicker,DatePicker,Modal } from 'antd';
import moment from 'moment';
import axios from 'axios';
import  "./index.css";
import config from "../../util/config";


const API = config.api
const RadioGroup = Radio.Group;
const Option = Select.Option;
const format = 'HH:mm';
let mom = moment().format('YYYY-MM-D'); 

class MathcedTabel extends Component {
  state = {
    value: 1,
    rowIndex:0,
    myData : [],
    matchedList:[],
    time:5,
    startTime:"null",
    endTime:"null",
    visible:false,
    imgSrc:''
  }
  // onChange = (e,record) => {
  //   console.log('radio checked', e,record);
  //   this.setState({
  //     value: e.target.value,
  //   });
  // }
  //  onChange(value, dateString) {
  //   console.log('Selected Time: ', value);
  //   console.log('Formatted Selected Time: ', dateString);
  // }
  getReq=()=>{
    axios.get(API.homeGet,{
      params:{
        startTime:`${this.state.startTime}`,
        endTime:`${this.state.endTime}`
      }
    })
    .then(res => {
      let list = res.data.data;
      list.map((item,idx)=>{
        item.key = item.id
      })
      list=list.reverse()
      console.log(list);
      
      this.setState({ matchedList:list });
    });
  }

  setTime0(time,timeString) {
    console.log(time,timeString);
    
   
     this.setState({
      "startTime":timeString
     })
  }
  setTime1(time,timeString) {
  
    this.setState({
      endTime:timeString
     }) 
  }
  handleCancel(){
    this.setState({
      visible:false
    })
  }
  onSelectChange=(val)=>{
    console.log(val);
    
  }
  render() {
    const columnsMatch = [
      {
        title: '照片',
        dataIndex: 'original_face',
        key: 'original_face',
        width:"20%",
        render:(original_face,record) => ( 
          <span>
            <img onClick={()=>{
              console.log(original_face);
              this.setState({
                imgSrc:original_face,
                visible:true
              })
            }} className="radioimg" src={original_face} alt=""/>
          </span>
        )
      },
       {
      title: 'PersonID',
      dataIndex: 'person_id',
      key: 'person_id',
      width:"40%"
    },{
      title:"捕获时间",
      dataIndex:"show_capture_at",
      key:"show_capture_at",
    }
  ];

    return (
      <div className="App">
      <Row type="flex" justify="space-between" className="row_top" >
        <Col span={2}><Button type="primary" onClick={()=>this.getReq()}>更新</Button></Col>
        <Col span={4} offset={14}>
           
          
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
    
       <Table 
       columns={columnsMatch} 
       dataSource={this.state.matchedList} 
      //  onRow={(record, index) => {
      //   return {
      //     onClick: (record) => {
      //       console.log(record);
            
      //     },      
      //   }
         
      //  }}
   
       />
         <Modal
          width={'35%'}
          footer={null}
          visible={this.state.visible}
          onCancel={this.handleCancel.bind(this)}
          style={{textAlign:"center"}}
        >
          <img style={{width:"80%",objectFit:"cover"}} src={this.state.imgSrc} alt=""/>
        </Modal>
      </div>
    );
  }
  componentWillMount (){
    this.getReq()
  }
}


export default MathcedTabel;