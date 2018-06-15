/**
 * @(#)userListView.jsx 0.1.0 2018-03-20
 * Copyright (c) 2018, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// React基础组件
import React from 'react'
// dva 连接组件 - 连接route和model
import {connect} from 'dva'
// 表单Form等Antd组件
import { Form,Input, Select, Row, Col, Checkbox, Button, DatePicker, Modal, Icon, Popconfirm } from 'antd';
// 表单域
const FormItem = Form.Item;
const Confirm = Modal.confirm
import moment from 'moment';
// const { RangePicker } = DatePicker;
import { get } from 'lodash'
import { Link } from "dva/router";
// 引入列表页组件
import ListPage from 'Components/PageTmpl/ListPage'
// 引入model取值工具方法
import { mapStateToProps } from 'Utils/view_utils'
import config from 'Config/config'
import comCss from 'Biz/common/comCss/comCss.less';
import $ from "jquery";
import styles from './userListStyle.less';
// 引入模拟数据
import mockData  from './mockData.json'
import { hashHistory } from 'dva/router'
 /**
 * 系统管理 - 用户管理列表 组件
 *
 * @author 扬帆
 * @since 0.1.0
 */
const userListView = function({dispatch, model, form}) {
  //表单校验
  const {resetFields,getFieldDecorator,validateFields,setFieldsValue} = form;

  // 取出model对象，命名空间
  const { modelObj, namespace } = model
  const { modalStatus } = modelObj;

  let pageProps = {
    // ---------- 界面部分 ----------
    "ui": {
      // 页面接口地址
      "api_url": "sys/user/list-by-page",
      // 接口方式
      "method": "GET",
      // 接口参数
      "params": "pageNum=1&pageSize=10",
      // 模拟数据 - 用于开发需要，若填充了上面的api_url之后，请将此项设置为null
      // "mockData": mockData,
      // 查询栏
      "search_bar": {
        "fields": [
          {
            "en_name": "userName",
            "zh_name": "用户账号",
            "elem_type": "Input",
            "elem_valid_type": "string"
          },
          {
            "en_name": "realName",
            "zh_name": "姓名",
            "elem_type": "Input",
            "elem_valid_type": "string"
          },
          {
            "en_name": "phone",
            "zh_name": "手机",
            "elem_type": "Input",
            "elem_valid_type": "string"
          },
          // 单选类型示例
          // {
          //   "en_name": "gender",
          //   "zh_name": "性别",
          //   "elem_type": "Select",
          //   "elem_valid_type": "string",
          //   "cmpt_items": [
          //     {"label": "男", "value": "1"},
          //     {"label": "女", "value": "2"}
          //   ],
          //   // "cmpt_field_name": "sexList"
          // },
          // 时间范围示例
          // {
          //   "en_name": "modifyDate",
          //   "zh_name": "创建时间",
          //   "elem_type": "Date",
          //   "split_keys": ['createTimeBegin', 'createTimeEnd'],
          //   "format": 'YYYY-MM-DD',
          //   "elem_valid_type": "string"
          // },
        ],
        // 重置按钮钩子函数, 在点击重置按钮时会被调用
        // 同样的, 还有 searchHandler 搜索按钮钩子函数
        // "resetHandler": () =>{
        //   updateModel(true, 'clearConditionFlag')
        //   setTimeout(() => {
        //     updateModel(false, 'clearConditionFlag')
        //   }, 300);
        // },

        // 自定义按钮设置, 与搜索/重置按钮同一排
        // "actions": [
        //   {
        //     "func_name": "more",
        //     // "label": "更多搜索条件",
        //     // "type": "primary",
        //     // "onClick": (e) =>{
        //     //   console.log('more')
        //     //   showModal()
        //     // }
        //     "render": () => {
        //       return <Button type="default" htmlType="button" onClick={() => $('#userList-children').slideToggle() }>更多搜索条件</Button>
        //     }
        //   }
        // ]
      },
      // 页面右上角操作栏
      "action_bar": [
        {
          "func_name": "onAdd",
          "label": "新增",
          "type": "primary",
          "icon": "plus",
          "onClick": (e) =>{
            hashHistory.push('/home/systemMgmt/userEdit');
          }
        }
      ],

      // 数据表格
      "table": {
        // 表头字段列表
        "fields": [
          {
            "en_name": "userName",
            "zh_name": "用户账号",
          },
          {
            "en_name": "realName",
            "zh_name": "姓名",
          },
          {
            "en_name": "phone",
            "zh_name": "手机号",
          },
          {
            "en_name": "createPerson",
            "zh_name": "创建人",
          },
          {
            "en_name": "createTime",
            "zh_name": "创建时间",
          },
          {
            "en_name": "status",
            "zh_name": "状态",
            "render" : (text, item, index) => {
              let stateName = '启用';
              if('2' === '' + text){
                stateName = '禁用';
              }
              return <span>{stateName}</span>
            }
          },
          // 可以通过传入render函数实现自定义渲染
          // {
          //   "en_name": "lockStatus",
          //   "zh_name": "锁定",
          //   "width": 70,
          //   "render" : (text, item, index) => {
          //     // 以下只有解锁功能
          //     // return (item.lockStatus == 2 ? <Link onClick={() => showConfirm(item.accountId, item.realName, item.lockStatus)} >
          //     //   <Icon type="lock" />
          //     // </Link> : <Icon type="unlock" /> )
          //     // 以下为锁定 + 解锁功能
          //     return (item.lockStatus == 2 ? <Link onClick={() => showConfirm(item.accountId, item.realName, item.lockStatus)} >
          //       <Icon type="lock" />
          //     </Link> : <Link onClick={() => showConfirm(item.accountId, item.realName, item.lockStatus)} >
          //       <Icon type="unlock" />
          //     </Link>
          //     )
          //   }
          // },
        ],

        // 表格操作
        // 操作栏设置
        "action_props": {
          "width": 170,
        },
        // 整个表格的宽度, 设置该属性后表格可左右滚动
        // "scroll": { x: 1665 },
        "actions": [
          {
            "func_name": "onDetail",
            "label": "查看",
            "type": "",
            "icon": "",
            "render": (item) => {
              return <Link
                onClick={()=>{
                  hashHistory.push('/home/systemMgmt/userDetails?id=' + item.id);
                }}
              >
                查看
              </Link>;
            },
          },
          {
            "func_name": "onEdit",
            "label": "编辑",
            "type": "",
            "icon": "",
            "render": (item) => {
              return <Link
                onClick={()=>{
                  hashHistory.push('/home/systemMgmt/userEdit?id=' + item.id);
                }}
              >
                编辑
              </Link>;
            },
          },
          {
            "func_name": "onStatus",
            "label": "",
            "type": "",
            "icon": "",
            // "onClick": (e) => {
            //   console.log('e:', e)
            // },
            "render": (item) => {
              let state = (1==item.status ? '禁用':'启用');
              return <Popconfirm
                title={`确定要${state}该用户吗?`}
                okText='确定'
                cancelText='取消'
                onConfirm={() => {
                  dispatch({
                    type: `${namespace}/updateUser`,
                    payload: {id: item.id, status: 1==item.status ? '2':'1'}
                  })
                }}
              >
                <Link>{state}</Link>
              </Popconfirm>;
            },
          },
          // 删除接口在func_name为onDelete时会自动添加popconfirm
          // {
          //   "func_name": "onDelete",
          //   "label": "删除",
          //   "api_url": "yundt/mgmt/item/prop/group/efficacyDel",
          //   "params": "&id=",
          //   "method": "DELETE"
          // }
        ]
      }
    },
  }

  if(!!modelObj.biz){
    pageProps.biz = modelObj.biz
    pageProps.biz.syncBackCbf = (biz) => {
      dispatch({
        type: `${namespace}/setFormVal`,
        payload: biz
      })
    }
  }

  return (
    <div>
      <ListPage pageProps={ pageProps }/>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(userListView))
