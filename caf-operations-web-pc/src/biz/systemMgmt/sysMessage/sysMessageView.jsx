/**
 * @(#)sysMessageView.jsx 0.1.0 2018-03-13
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import React from 'react';
// dva 连接组件 - 连接route和model
import {connect} from 'dva';
// 选项卡、表格、弹出确认框
import { Tabs, Form, Table, Pagination, message, Input, Select, Row, Col, Button, InputNumber,TreeSelect, Popconfirm, Icon,Popover,Modal } from 'antd';
const Confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
// 获取样式类名
import cx from 'classnames'
// 当前页面样式
// import styles  from './sysMessageStyle.less'
import config from '../../../config/config'
import {isEmpty, cloneDeep, extend, get} from 'lodash'
import TableMove from "../../../components/tableMove/index";
// 表单域
const FormItem = Form.Item;
// 判断对象是否为空
import { Link,hashHistory } from 'dva/router'
/**
 * description 路由视图及事件处理
 * dispatch 分发到models中的effects对应事件名
 * model 用于获取models中state定义的数据
 */
 /**
 * 系统管理 - 系统消息 组件
 *
 * @author 阿九
 * @since 0.1.0
 */

const sysMessageView = function({dispatch, sysMessageModel}) {

  const {selectedIds, msgList, total, search} = sysMessageModel;

  const tabChangeHandler = function(tabIndex) {
    updateModel({status:tabIndex}, 'search', true);
    dispatch({
      type: 'sysMessageModel/getList',
      payload: search
    });

 }

  //分页发生时所调用的方法
  function pageChangeHandler(page, t, size) {
    if (t == 'tabs') {
      //onReset()
    }
    var v = t == 'tabs' ? `?tabs=${page}&page=1` : `?page=${page}&tabs=${search.queryType}`;
    v = size ? v + `&pageSize=${size}` : v;
    hashHistory.push('/home/systemMgmt/sysMessage' + v);
    updateModel([], 'selectedIds');
  }

  const deleteMsg = e => {
    dispatch({
      type: 'sysMessageModel/deleteMsg',
      payload: {messageIds:e}
    });
  }

  function modalOk(name, type, id) {
    if(name ==  'delmsg') {
      deleteMsg(id)
    }
  }

  function showDelete() {
    Confirm({
      title:'确认',
      content:'是否要删除选中的消息?',
      onOk: () => {
        deleteMsg(selectedIds.join(','))
      }
    })
  }

  const markMsg = e => {
    console.log('mark ID->', e)
    dispatch({
      type: 'sysMessageModel/markMsg',
      payload: {messageIds:e}
    });
  }



  //分页数据
  const pagination = {
    current: parseInt(search.pageNum),//当前页
    pageSize: search.pageSize,//单页条数
    total: total,//总条数
    showTotal: e=>`共 ${total} 条`,
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: (page, size)=> {
      pageChangeHandler(page, "", size);
    },
    onChange: (page)=> {
      pageChangeHandler(page, "", search.pageSize) //分页事件
    }
  }

  // 更新状态
  function updateModel(value, name, deep=false) {
    let obj = sysMessageModel;
    if(deep) {
      extend(obj[name], value)
    } else {
      obj[name] = value;
    }
    dispatch({
      type:'sysMessageModel/updateModel'
    })
  }

  const content = (item) => (
    <ul>
      <li><Link onClick={e=>{markMsg(item.id)}}>标为已读</Link></li>
      <li>
        <Popconfirm title="您真的要删除吗?" onConfirm={e=>{modalOk('delmsg',0,item.id)}} okText="确定" cancelText="取消">
            <Link>删除</Link>
        </Popconfirm>
      </li>
    </ul>
  )

  const columns = [{
    title:'标题',
    dataIndex:'title',
    key:'title'
  }, {
    title:'创建时间',
    dataIndex:'createTime',
    key:'createTime'
  },{
    title:'操作',
    key:'action',
    render : (text, record) => (
      <span>
        <Link>查看</Link>
        <span className={cx("ant-divider")}/>
        <Popover content={content(record)}  placement="bottomLeft" trigger="click">
        <Link>更多</Link>
        </Popover>
      </span>
    )
  }];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    updateModel(selectedRowKeys, 'selectedIds')
  },
  getCheckboxProps: record => ({
    name: record.name
  }),
};

  return (
    <div className="public_listMain">
     <div className="functionButton">
      <Button type="danger" disabled={!selectedIds.length} onClick={showDelete}>删除</Button>
      <Button type="primary" disabled={!selectedIds.length>0} onClick={e=> {markMsg(selectedIds.join(','))}}>标为已读</Button>
      </div>
      <div className="boxShadow">
      <Tabs tabPosition="buttom"
              onChange={e => tabChangeHandler(e)}
              type="card">
          <TabPane tab="未读" key="0"></TabPane>
          <TabPane tab="已读" key="1"></TabPane>
        </Tabs>
        <Table
          rowSelection={rowSelection}
          showHeader={false}
          columns={columns}
          pagination={pagination}
          dataSource={msgList}/>
      </div>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(({ sysMessageModel }) => ({ sysMessageModel }))(Form.create()(sysMessageView))
