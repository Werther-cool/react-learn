import React, { Component } from 'react';
import { Modal,Table,Button,Radio,Row,Col,Select,TimePicker,DatePicker } from 'antd';
import moment from 'moment';
import axios from 'axios';
import  "./index.css";
import config from "../../util/config";

const API = config.api
const RadioGroup = Radio.Group;
const Option = Select.Option;
const format = 'HH:mm';
let mom = moment().format('YYYY-MM-D'); 

class PhotoModal extends React.Component {
  state = { 
  
    defaultTime:this.props.defaultTime,
    visible: this.props.visible,
    matchedList:[],
    startTime:"null",
    endTime:"null"
   }
   pushReq = this.props.pushReq
   closeModal= this.props.closeModal

  componentDidMount(){
    this.props.onRef(this)
  }

  confirm=(events,record)=>{
    this.props.pushReq(record)
    console.log(events,record);
    this.props.closeModal()
  }

  getReq=()=>{
    console.log("photomadal");  
    axios.get(API.homeGet,{
      params:{
        startTime:`${this.state.startTime}`,
        endTime:`${this.state.endTime || this.props.defaultTime}`
      }
    })
    .then(res => {
      let list = res.data.data;
      list.map((item,idx)=>{
        item.key = item.id
      })
      list=list.reverse()
      this.setState({ matchedList:list });
    });
  }

  setTime0(time,timeString) {
 
    this.setState({
     startTime:timeString
    })
   console.log(time, timeString);
 }
 setTime1(time,timeString) {

   this.setState({
     endTime:timeString
    })
    
   console.log(time, timeString);
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
                <img className="modalimg" src={original_face} alt=""/>
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
        },  {
          title:"关联",
          dataIndex:'id',
          key:"id",
          width:"20%",
          render:(events,record)=>{ 
          return (<Button  type='primary' onClick={this.confirm.bind(this,events,record)}>关联</Button>)
          }  
        }
      ];
    return (
      <div>
       
        <Modal

          visible={this.props.visible}
          // onOk={this.handleOk}
          onCancel={this.props.closeModal}
          width={'90%'}
          footer={null}
        >

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
            columnWidth={50}
            pagination={{defaultPageSize:8}}
            />
        </Modal>
      </div>
    );
  }
}
export default PhotoModal
