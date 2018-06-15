/**
 * @(#)smsTempletListView.jsx 0.2.0 2018-05-14
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// React基础组件
import React from 'react'
// dva 连接组件 - 连接route和model
import { connect } from 'dva'
// 表单Form等Antd组件
import { Form, Input, Select, Row, Col, Checkbox, Button, DatePicker, Modal, Icon, Popconfirm } from 'antd';
// 表单域
const FormItem = Form.Item;
const Confirm = Modal.confirm
import moment from 'moment';
// const { RangePicker } = DatePicker;
import { get } from 'lodash'
import { Link } from "dva/router";
// 引入列表页组件
import ListPage from '../../../components/PageTmpl/ListPage'
// 引入model取值工具方法
import { mapStateToProps } from '../../../utils/view_utils'
import config from '../../../config/config'
import comCss from '../../common/comCss/comCss.less';
import $ from "jquery";
import styles from './smsTempletListStyle.less';
import { browserHistory, hashHistory } from 'dva/router'
/**
* 消息管理 - 短信模板列表 组件
*
* @author 贾诩
* @since 0.2.0
*/
const routeView = function ({ dispatch, model, form }) {
  const { resetFields, getFieldDecorator, validateFields, setFieldsValue } = form;
  // 取出model对象，命名空间
  const { modelObj, namespace } = model
  const { modalStatus } = modelObj;

  let pageProps = {
    // ---------- 界面部分 ----------
    "ui": {
      // 页面接口地址
      // "api_url": "http://192.168.33.11:8004/mocking/caf/api/v1/comm/message/list-by-page",
      "api_url": "comm/message/list-by-page",
      // 接口方式
      "method": "GET",
      // 接口参数
      "params": "pageNum=1&pageSize=10&messageType=1",
      // 模拟数据 - 用于开发需要，若填充了上面的api_url之后，请将此项设置为null
      // "mockData": mockData,
      // 查询栏
      "search_bar": {
        "fields": [
          {
            "en_name": "templateCode",
            "zh_name": "模板编号",
            "elem_type": "Input",
            "elem_valid_type": "string"
          },
          {
            "en_name": "messageTaget",
            "zh_name": "消息接收方",
            "elem_type": "Select",
            "elem_valid_type": "string",
            "cmpt_items": [
              { "label": "消费者", "value": "1" },
              { "label": "平台端区域经理", "value": "2" },
              { "label": "经销商线索跟进人", "value": "3" },
              { "label": "平台端", "value": "4" },
              { "label": "经销商", "value": "5" }
            ],
            // "cmpt_field_name": "sexList"
          },
          {
            "en_name": "businessType",
            "zh_name": "消息类型",
            "elem_type": "Select",
            "elem_valid_type": "string",
            "cmpt_items": [
              { "label": "系统消息", "value": "1" },
              { "label": "订单消息", "value": "2" },
              { "label": "活动消息", "value": "3" },
              { "label": "其他", "value": "4" }
            ],
            // "cmpt_field_name": "sexList"
          },
          {
            "en_name": "templateName",
            "zh_name": "触发事件",
            "elem_type": "Input",
            "elem_valid_type": "string"
          },
          {
            "en_name": "title",
            "zh_name": "消息标题",
            "elem_type": "Input",
            "elem_valid_type": "string"
          },
        ],
      },
      // 页面右上角操作栏
      "action_bar": [
        // {
        //   "func_name": "onAdd",
        //   "label": "新增",
        //   "type": "primary",
        //   "icon": "plus",
        //   "onClick": () => {
        //     hashHistory.push('/home/systemMgmt/roleMgmt')
        //   }
        // }
      ],

      // 数据表格
      "table": {
        // 表头字段列表
        "fields": [
          {
            "en_name": "templateCode",
            "zh_name": "短信模板编号",
          },
          {
            "en_name": "messageTaget",
            "zh_name": "消息接收方",
            "render":(text) => {
              return <span>{["","消费者","平台端区域经理","经销商线索跟进人","平台端","经销商"][text]}</span>
            }
          },
          {
            "en_name": "businessType",
            "zh_name": "消息类型",
            "render":(text) => {
              return <span>{["","系统消息","订单消息","活动消息","其他"][text]}</span>
            }
          },
          {
            "en_name": "templateName",
            "zh_name": "触发事件",
          },
          {
            "en_name": "title",
            "zh_name": "消息标题",
          },
          {
            "en_name": "content",
            "zh_name": "模板内容",
          },
        ],

        // 表格操作
        // 操作栏设置
        "action_props": {
          "width": 120,
        },
        // 整个表格的宽度, 设置该属性后表格可左右滚动
        // "scroll": { x: 1665 },
        "actions": [
          // {
          //   "func_name": "onDetail",
          //   "label": "查看",
          //   "url": "/home/messageMgmt/templetDetail",
          //   "params": "id=&pageType=1"
          // },
          // {
          //   "func_name": "onEdit",
          //   "label": "编辑",
          //   "url": "/home/messageMgmt/roleMgmt",
          //   "params": "id=&pageType=2"
          // }
        ]
      }
    },
  }

  if (!!modelObj.biz) {
    pageProps.biz = modelObj.biz
    pageProps.biz.syncBackCbf = (biz) => {
      dispatch({
        type: `${namespace}/setFormVal`,
        payload: biz
      })
    }
  }

  //状态值变化
  function updateModel(value, name, modHierarchy) {
    let obj = modelObj;
    if (modHierarchy) {
      modHierarchy = modHierarchy.split(".");
      modHierarchy.map(e => {
        obj = obj[e];
      });
    }
    //如果是时间
    if (name == 'time') {
      obj['startTime'] = value[0];//发布开始时间
      obj['endTime'] = value[1];//发布结束时间
    } else {
      obj[name] = value;
    }
    // 分发到model
    dispatch({
      type: `${namespace}/updateModel`,
      payload: obj
    });
  };

  return (
    <div>
      <ListPage pageProps={pageProps} />
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
