/**
 * @(#)secondaryPropsView.jsx 0.1.0 2018-03-19
 * Copyright (c) 2017, YUNXI. All rights reserved.
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
import { get, cloneDeep, isArray } from 'lodash'
import { Link } from "dva/router";
// 引入列表页组件
import ListPage from '../../../components/PageTmpl/ListPage'
// 引入model取值工具方法
import { mapStateToProps } from '../../../utils/view_utils'
import config from '../../../config/config'
import comCss from '../../common/comCss/comCss.less';
import $ from "jquery";
import styles from './secondaryPropsStyle.less';
// 引入模拟数据
import mockData  from './mockData'
 /**
 * 系统管理 - 辅助属性 组件
 *
 * @author 阿九
 * @since 0.1.0
 */

 //布局配置
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 13
  },
}
const routeView = function({dispatch, model, form}) {
  const {resetFields,getFieldDecorator,validateFields,setFieldsValue} = form;
  // 取出model对象，命名空间
  const { modelObj, namespace } = model
  const { modalStatus } = modelObj;

  let pageProps = {
    // ---------- 界面部分 ----------
    "ui": {
      // 页面接口地址
      "api_url": "sys/prop/list-by-page",
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
            "en_name": "name",
            "zh_name": "属性名称",
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
        // {
        //   "func_name": "onAdd",
        //   "label": "新增",
        //   "type": "primary",
        //   "icon": "plus",
        //   "onClick": (e) =>{

        //   }
        // }
      ],

      // 数据表格
      "table": {
        // 表头字段列表
        "fields": [
          {
            "en_name": "code",
            "zh_name": "属性编号",
            "width"  : 85,
          },
          {
            "en_name": "name",
            "zh_name": "属性名称",
            "width": 100
          },
          {
            "en_name": "value",
            "zh_name": "属性值",
            "width": 200,
            "render" : (text, record, index) => {
              let values = isArray(record.values) ? record.values.map(e => e.value) : []
              return <span>{ values.join(', ') }</span>
            }
          },
          {
            "en_name": "describe",
            "zh_name": "属性描述",
            // "width": 80,
          },
          {
            "en_name": "location",
            "zh_name": "所在页面",
            "width": 120,
            // "render" : (text, item, index) => {
            //   return <span>{type[text]}</span>
            // }
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
          "width": 80,
        },
        // 整个表格的宽度, 设置该属性后表格可左右滚动
        // "scroll": { x: 1665 },
        "actions": [
          {
            "func_name": "onEdit",
            "label": "编辑",
            "type": "",
            "icon": "",
            "onClick": (e, record) => {
              record.visible = true
              updateModel(cloneDeep(record), 'modalState')
            },
            // "render": () => {
            //   return <a href='javascript:;' onClick={e => console.log('点击')}>编辑</a>
            // },
          },
          // {
          //   "func_name": "onDetail",
          //   "label": "查看详情",
          //   "type": "",
          //   "icon": "",
          //   "url": "/home/userMgmt/userDetails",
          //   "params": "accountId="
          // },
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

  //状态值变化
  function updateModel(value, name, objName, index) {
    let obj = modelObj;
    if (objName) {
      if (name === 'value') {
        obj[objName][name][index] = value
      } else {
        obj[objName][name] = value
      }
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

  // 编辑属性
  function updateProp() {
    updateModel(true, 'loading')
    dispatch({
      type: `${namespace}/updateProp`,
      payload: {}
    });
  }

  // 添加属性值
  function addProp() {
    dispatch({
      type: `${namespace}/addProp`,
      payload: {}
    });
  }

  // 删除属性值
  function deleteProp(index) {
    dispatch({
      type: `${namespace}/deleteProp`,
      payload: {
        index
      }
    });
  }

  // 更新modalState
  function updateModalState(value, name, objName, index) {
    dispatch({
      type: `${namespace}/updateModalState`,
      payload: {
        value, name, objName, index
      }
    });
  }

  return (
    <div>
      <Modal
        title='编辑'
        visible={modelObj.modalState.visible}
        onCancel={() => updateModel(false, 'visible', 'modalState')}
        onOk={updateProp}
        confirmLoading={get(modelObj, 'loading')}
        width={800}
      >
        <Row>
          <Col>
            <FormItem label='属性编号' {...formItemLayout}>
              {
                form.getFieldDecorator('code', {
                  initialValue: get(modelObj.modalState,'code'),
                  rules: [
                    {
                      required: true, message: '站点名称不能为空，长度限制在60字符以内'
                    },
                    {
                      max: 60, message: '站点名称不能为空，长度限制在60字符以内'
                    },
                    // {validator: validiateSpecialStr}
                  ]
                })(
                  <Input disabled={true} />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label='属性名称' {...formItemLayout}>
              {
                form.getFieldDecorator('name', {
                  initialValue: get(modelObj.modalState,'name'),
                  rules: [
                    {
                      required: true, message: '站点名称不能为空，长度限制在60字符以内'
                    },
                    {
                      max: 60, message: '站点名称不能为空，长度限制在60字符以内'
                    },
                    // {validator: validiateSpecialStr}
                  ]
                })(
                  <Input onChange={e => updateModel(e.target.value, 'name', 'modalState')} />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label='属性描述' {...formItemLayout}>
              {
                form.getFieldDecorator('describe', {
                  initialValue: get(modelObj.modalState,'describe'),
                  rules: [
                    {
                      required: true, message: '站点名称不能为空，长度限制在60字符以内'
                    },
                    {
                      max: 60, message: '站点名称不能为空，长度限制在60字符以内'
                    },
                    // {validator: validiateSpecialStr}
                  ]
                })(
                  <Input onChange={e => updateModel(e.target.value, 'describe', 'modalState')} />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label='属性值' {...formItemLayout}>
              <Button type='primary' onClick={addProp} >添加属性值</Button>
              {
                !!get(modelObj.modalState,'values') && get(modelObj.modalState,'values').map((item, index) => {
                  return <Row key={'propCell_' + index} className={styles.propCell} >
                    <Col span={16}>
                      <Input value={item.value} onChange={e => updateModalState(e.target.value, 'value', 'values', index)} />
                    </Col>

                    <Col span={8}>
                      <Popconfirm
                        title='确定要删除吗?'
                        okText='确定'
                        cancelText='取消'
                        onConfirm={() => deleteProp(index)}
                      >
                        <Icon style={{fontSize: 24}} type="close-circle"/>
                      </Popconfirm>
                    </Col>
                  </Row>
                })
              }
            </FormItem>
          </Col>
        </Row>
      </Modal>
      <ListPage pageProps={ pageProps }/>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
