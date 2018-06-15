/**
 * @(#)brandManView.jsx 0.1.0 2018-03-20
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * 车型管理 - 品牌管理
 *
 * @author 亦可
 * @since 0.1.0
 */

// React基础组件
import React from 'react'
// dva 连接组件 - 连接route和model
import {connect} from 'dva'
// 表单Form等Antd组件
import { Form,Input, Select, Row, Col, Checkbox, Button, DatePicker, Modal, Icon, Popconfirm,Upload ,message} from 'antd';
// 表单域
const FormItem = Form.Item;
const Confirm = Modal.confirm
import moment from 'moment';
// const { RangePicker } = DatePicker;
import { get } from 'lodash'
import { Link } from "dva/router";
// 引入列表页组件
import ListPage from '../../../components/PageTmpl/ListPage'
import Img from '../../common/imgBoost/indexImg';
// 引入model取值工具方法
import { mapStateToProps } from '../../../utils/view_utils'
import config from '../../../config/config'
import comCss from '../../common/comCss/comCss.less';
import $ from "jquery";
import styles from './brandManStyle.less';
//上传图片组件
import Uploader from '../../../components/Upload'
import Cookie from 'js-cookie'

const routeView = function({dispatch, model, form}) {
  const {resetFields,getFieldDecorator,validateFields,setFieldsValue,validateFieldsAndScroll} = form;
  // 取出model对象，命名空间
  const { modelObj, namespace } = model
  const { biz,visible,obj,editId} = modelObj;
   // 表单项布局
   const formItemLayout = {
     labelCol: {span: 4},
     wrapperCol: {span: 16}
   };

  let pageProps = {
    // ---------- 界面部分 ----------
    "ui": {
      // 页面接口地址
      "api_url": "caf/mgmt/items/brand/list-by-page",
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
            "en_name": "code",
            "zh_name": "品牌编号",
            "elem_type": "Input",
            "elem_valid_type": "string"
          },
          {
            "en_name": "name",
            "zh_name": "品牌名称",
            "elem_type": "Input",
            "elem_valid_type": "string"
          },
          {
            "en_name": "keyword",
            "zh_name": "别名",
            "elem_type": "Input",
            "elem_valid_type": "string"
          },
        ],
      },
      // 页面右上角操作栏
      "action_bar": [
        {
          "func_name": "onAdd",
          "label": "新增",
          "type": "primary",
          "icon": "plus",
          "onClick": (e) =>updateVisible(true,'add')
        }
      ],

      // 数据表格
      "table": {
        // 表头字段列表
        "fields": [
          {
            "en_name": "logoUrl",
            "zh_name": "logo  ",
            "width"  : 85,
            "render": (d,item,index) => {
              return <div className={styles.imgSty}><img src={item.logoUrl} alt=""/></div>
            },
          },
          {
            "en_name": "code",
            "zh_name": "品牌编号",
            "width": 170
          },
          {
            "en_name": "name",
            "zh_name": "品牌名称",
            "width": 120
          },
          {
            "en_name": "keyword",
            "zh_name": "别名",
            "width": 150,
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
            "func_name": "onEdit",
            "label": "编辑",
            "type": "",
            "icon": "",
            /*"onClick": (e) => {
              console.log('e:', e)
            },*/
            "render": (item) => {
              return <a href='javascript:;' onClick={e => updateVisible(true,'edit',item)}>编辑</a>
            },
          },
          //删除接口在func_name为onDelete时会自动添加popconfirm
          {
            "func_name": "Delete",
            /*"label": "删除",
            "api_url": "caf/mgmt/items/brand/delete",
            "params": "id=",
            "method": "DELETE"*/
            "render": (item) => {
              return (<span>
                {item.used?<a href='javascript:;' onClick={e => ondelete(item,'delete')} disabled>删除</a>:<a href='javascript:;' onClick={e => ondelete(item,'delete')}>删除</a>}
              </span>)
            },
          }
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
  //删除
  function ondelete(item) {
    // 分发到model
    dispatch({
      type: `${namespace}/ondelete`,
      payload: {item}
    });
  };

   let tittle='新增品牌'
   if(modelObj.editId+''!==''){
     tittle='编辑品牌'
   }
   //更新弹窗值
   function updateVisible(value,name,e) {
     form.resetFields();
     // 分发到model
     dispatch({
       type: `${namespace}/setVisible`,
       payload: {visible:value,name:name,item:e}
     });
   };

  //状态值变化
   function updateModel(value,name) {
    dispatch({
      type:`${namespace}/updateModel`,
      payload:{
        value,
        name,
      }
    })
   };

   return (
    <div>
      <Modal visible={visible}
             onOk={e => {
               e.preventDefault();
               // 校验参数
               validateFieldsAndScroll((errors, values) => {
                 if (errors) {
                   return false;
                 }
                 dispatch({
                   type: `${namespace}/okFun`,
                   payload: {}
                 })
               });
               }
             }
             onCancel={e => {
               dispatch({
                 type: `${namespace}/setVisible`,
                 payload: {visible:false}
               });
             }}
             title={tittle}
             width="600px"
      >
        <Form>
          <Row>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="品牌编号">
                {getFieldDecorator('code', {
                  initialValue: obj.code,
                  rules: [
                    {required: true, message: '请输入品牌编号'},
                    {max: 20, message: '最大20位'},
                  ],
                })
                (<Input placeholder="请输入品牌编号" onChange={e=>updateModel(e.target.value,'code')}/>)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="品牌名称">
                {getFieldDecorator('name', {
                  initialValue: obj.name,
                  rules: [
                    {required: true, message: '请输入品牌名称'},
                    {max: 20, message: '最大20位'},
                  ],
                })
                (<Input placeholder="请输入品牌名称" onChange={e=>updateModel(e.target.value,'name')}/>)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="别名">
                {getFieldDecorator('keyword', {
                  initialValue: obj.keyword,
                  rules: [
                    {required: false, message: '请输入别名'},
                    {max: 20, message: '最大20位'},
                  ],
                })
                (<Input placeholder="请输入别名" onChange={e=>updateModel(e.target.value,'keyword')}/>)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="logo">
                <Uploader
                  uploadSuccessCbf={imgUrl => updateModel(imgUrl, 'logoUrl') }
                  removeFileCbf={() => updateModel('', 'logoUrl')}
                  showType='2'
                  fileType='image'
                  fileMaxSize={2}
                  uploadedUrls={obj.logoUrl}
                  uploadTip={() => {
                    return <p>支持扩展名：.png .jpg .gif<br/>建议尺寸: 400x250像素</p>
                  }}
                />
                <p>建议：图片大小不超过2MB，仅支持jpg,png格式</p>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
      <ListPage pageProps={ pageProps }/>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
