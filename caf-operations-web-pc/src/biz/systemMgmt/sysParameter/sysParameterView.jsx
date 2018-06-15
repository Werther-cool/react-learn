/**
 * @(#)sysParameterView.jsx 0.1.0 2019-03-19
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * 系统管理 - 系统参数 组件
 *
 * @author 亦可
 * @since 0.1.0
 */

import React from 'react';
// dva 连接组件 - 连接route和model
import {connect} from 'dva';
// 选项卡、表格、弹出确认框
import { Tabs, Form, Table, Pagination, message, Input,Row, Col, Button, Popconfirm, Icon ,Modal,Select } from 'antd';
// 引入model取值工具方法
import { mapStateToProps } from '../../../utils/view_utils'
// 获取样式类名
import cx from 'classnames'
// 当前页面样式
import styles  from './sysParameterStyle.less'
import config from '../../../config/config'
import {isEmpty, cloneDeep, get} from 'lodash'
import TableMove from "../../../components/tableMove/index";
// 表单域
const FormItem = Form.Item;
// 判断对象是否为空
import { Link,hashHistory } from 'dva/router'
const Option = Select.Option;
// 引入列表页组件
import ListPage from '../../../components/PageTmpl/ListPage'
// 引入模拟数据
import mockData  from './mockData'
//form表单布局
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
}

const sysParameterView = function({dispatch, model, form}) {
   // 取出model对象，命名空间
   const { modelObj, namespace } = model
   // console.log('modelObj',modelObj)
   const { visible, param} = modelObj;
  // 表单的子函数
  const {resetFields, getFieldDecorator, validateFields, setFieldsValue} = form
   //列表参数
   let pageProps = {
     // ---------- 界面部分 ----------
     "ui": {
       // 页面接口地址
       "api_url": "sys/parameter/list",
       // 接口方式
       "method": "GET",
       // 接口参数
       "params": "pageNum=1&pageSize=10",
       // 模拟数据 - 用于开发需要，若填充了上面的api_url之后，请将此项设置为null
       // "mockData": mockData,
       // 数据表格
       "table": {
         // 表头字段列表
         "fields": [
           {
             "en_name": "name",
             "zh_name": "说明",
             "width"  : 85,
           },
           {
             "en_name": "value",
             "zh_name": "参数",
             "width": 170
           },
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
             "label": "设置参数",
             "type": "",
             "icon": "",
             "onClick": (text,item,index) => {
               form.resetFields();
               dispatch({
                 type:`${namespace}/changeStatus`,
                 payload:{
                   value:true,
                 }
               });
               dispatch({
                 type:`${namespace}/setModalVal`,
                 payload:{
                   ...item
                 }
               })
             },
           },
         ]
       },
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
   //modal点击确定
   const modalOk = () => {
     dispatch({
       type: `${namespace}/submitVal`,
       payload: {}
     });
   }
   //设置参数
   const setParam = (value) => {
     dispatch({
       type: `${namespace}/setModalVal`,
       payload: {value}
     });
   }

  return (
    <div>
      <Modal visible={visible}
             onOk={e => modalOk()}
             onCancel={e => {
               dispatch({
                 type: `${namespace}/changeStatus`,
                 payload: {value:false}
               });
             }}
             title='设置参数'
             width="500px"
      >
        <FormItem
          {...formItemLayout}
          label="参数">
          {getFieldDecorator('param', {
            initialValue:param.value ,
            rules: [
              {required: true, message: '请输入参数'},
              {max: 4, message: '请输入1~9999'},
              {pattern: /^[1-9]\d*$/, message: '参数只能为正整数!'}
            ],
          })
          (<Input onChange={e => { setParam(e.target.value) }}/>)
          }
        </FormItem>

      </Modal>
      <ListPage pageProps={ pageProps }/>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(sysParameterView))
