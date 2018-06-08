import React, { Component } from 'react';
import { Table,Button,Radio,Row,Col,Select,Icon,Input} from 'antd';
import axios from 'axios';
import  "./mytable.css";
import config from "../../util/config";
import qs from 'qs';
const API = config.api
const RadioGroup = Radio.Group;
const Option = Select.Option;
const Search = Input.Search;

class MathcedTabel extends Component {
  state = {
    value: 1,
    rowIndex:0,
    myData : [],
    matchedList:[],
    time:5
  }
  onChange = (e,record) => {

    this.setState({
      value: e.target.value,
    });
  }
  getReq=()=>{
    axios.get(`${API.mached}`)
    .then(res => {
      let list = res.data.data;
      list.map((item,idx)=>{
        item.key = item.id
      })
      list=list.reverse()
  
      
      this.setState({ matchedList:list });
    });
  }
  cancelReq=(id)=>{
    const self = this;
    axios({
      method: 'post',
      url:`${API.delete}`,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({id:id}),
    })
    .then(res => {
      self.getReq()
    });
  }
  pushId=(id,record)=>{
  
    const self = this;
    axios({
      method: 'post',
      url:`${API.pushId}`,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({id:record.id}),
    })
    .then(res => {
      self.getReq()
    });
  }
 
  pushAllId=()=>{
    const self = this;
    axios({
      method: 'post',
      url:`${API.pushAllId}`,
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
    .then(res => {
      self.getReq()
    });
  }

 /* 搜索名字 */
  searchName=(name)=>{
    console.log(name);
    axios({
      method: 'post',
      url:`${API.searchMached}`,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({keyword:name}),
    })
    .then(res => {
      let searchList  = res.data.data;
      searchList.map((val,idx)=>{
        val.key = val.id
      })
    
    this.setState({
      matchedList:searchList
    })
      
    }); 
  }

  render() {
    const columnsMatch = 
    [
        {
        title: '姓名',
        dataIndex: 'user_name',
        key: 'user_name',
        width:"10%",
        render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: '手机号码',
        dataIndex: 'user_phone',
        key: 'user_phone',
        width:"10%"
      }, {
        title: '照片',
        dataIndex: 'original_face',
        key: 'original_face',
        width:"10%",
        render:(original_face,record) => ( 
          <span>
            <img className="radioimg" src={original_face} alt=""/>
          </span>
        )
      },
      {
        title: 'PersonID',
        dataIndex: 'person_id',
        key: 'person_id',
        width:"20%"
      },
      {
        title: '注册时间',
        dataIndex: 'sign_time',
        key: 'sign_time',
        width:"15%"
      },
      {
        title: '最近到访时间',
        dataIndex: 'capture_at',
        key: 'capture_at',
        width:"15%"
      },
      {
        title:"推送",
        dataIndex:"is_push",
        key:"status",
        width:"10%",
        render:(events,record)=>{
          return (events?
            <Icon type="check" style={{ fontSize: 16, color: 'green' }}/>
            :<Button  type='primary' onClick={this.pushId.bind(this,events,record)}>推送</Button>)
        } 
      },
      {
        title:"取消关联",
        dataIndex:'id',
        key:"id",
        width:"15%",
        render:(events,record)=>{ 
        return (<Button  disabled={record.is_push} type='primary' onClick={this.cancelReq.bind(this,events)}>取消关联</Button>)
          
        }
      }
    ];
    
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
        <Col span={2} offset={16}><Button disabled={this.state.matchedList.length==0} type="primary" onClick={()=>this.pushAllId()}>全部推送</Button></Col>
      </Row>
    
       <Table 
       columns={columnsMatch} 
       dataSource={this.state.matchedList} 
       />
      </div>
    );
  }
  componentWillMount (){
    this.getReq()
  }
}


export default MathcedTabel;