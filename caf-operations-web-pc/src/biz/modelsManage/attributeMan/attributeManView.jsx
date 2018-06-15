/**
 * @(#)attributeManView.jsx 0.1.0 2018-03-20
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * 车型管理 - 属性管理 组件
 *
 * @author 亦可
 * @since 0.1.0
 */

// React基础组件
import React from 'react'
// dva 连接组件 - 连接route和model
import { connect } from 'dva'
// 表单Form等Antd组件
import { Form, Input, Select, Row, Col, Checkbox, Button, DatePicker, Modal, Icon, Popconfirm, Radio, Table, Upload, message } from 'antd';
const RadioGroup = Radio.Group;
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
import cx from 'classnames'
import comCss from '../../common/comCss/comCss.less';
import $ from "jquery";
import styles from './attributeManStyle.less';
// 引入模拟数据
import mockData from './mockData'
//上传图片组件
import Uploader from '../../../components/Upload'
import Cookie from 'js-cookie'

const routeView = function ({ dispatch, model, form }) {
  const { resetFields, getFieldDecorator, validateFields, setFieldsValue, validateFieldsAndScroll } = form;
  // 取出model对象，命名空间
  const { modelObj, namespace } = model
  const { visible, obj, dataSource, popVisible } = modelObj
  // 表单项布局
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
  };
  //状态值转换文字
  function vualeText(value, name) {
    if (name == 'showType') {
      switch (value) {
        case 4:
          return '下拉'
          break;
        case 5:
          return '文本'
          break;
        case 6:
          return '颜色'
          break;
      }
    }
    if (name == 'fillType') {
      switch (value) {
        case 0:
          return '否'
          break;
        case 1:
          return '是'
          break;
      }
    }
  }

  //更新弹窗值
  function updateVisible(value, name, e) {
    form.resetFields();
    // 分发到model
    dispatch({
      type: `${namespace}/setVisible`,
      payload: { visible: value, name: name, item: e }
    });
  };

  let pageProps = {
    // ---------- 界面部分 ----------
    "ui": {
      // 页面接口地址
      "api_url": "caf/mgmt/items/prop/list-by-page",
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
          {
            "en_name": "showType",
            "zh_name": "显示类型",
            "elem_type": "Select",
            "elem_valid_type": "string",
            "cmpt_items": [
              { "label": "下拉", "value": "4" },
              { "label": "文本", "value": "5" },
              { "label": "颜色", "value": "6" }
            ],
          }
        ],
      },
      // 页面右上角操作栏
      "action_bar": [
        {
          "func_name": "onAdd",
          "label": "新增",
          "type": "primary",
          "icon": "plus",
          "onClick": (e) => updateVisible(true, 'add')
        }
      ],

      // 数据表格
      "table": {
        // 表头字段列表
        "fields": [
          {
            "en_name": "name",
            "zh_name": "属性名称 ",
            "width": 85,
          },
          {
            "en_name": "statement",
            "zh_name": "属性描述",
            "width": 170
          },
          {
            "en_name": "showType",
            "zh_name": "显示类型",
            "width": 120,
            "render": (d, item, index) => {
              return <span>{vualeText(item.showType, 'showType')}</span>
            },
          },
          /*{
            "en_name": "fillType",
            "zh_name": "是否必填",
            "width": 150,
            "render": (d,item,index) => {
              return <span>{vualeText(item.fillType,'fillType')}</span>
            },
          },*/
          {
            "en_name": "valueText",
            "zh_name": "属性值",
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
            "render": (item) => {
              return <a href='javascript:;' onClick={() => updateVisible(true, 'edit', item)}>编辑</a>
            },
          },
          //删除接口在func_name为onDelete时会自动添加popconfirm
          // {
          //   "func_name": "onDelete",
          //   "label": "删除",
          //   "api_url": "caf/mgmt/items/prop/delete",
          //   "params": "&id=",
          //   "method": "DELETE"
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
  function updateModel(value, name, i) {
    // 分发到model
    dispatch({
      type: `${namespace}/updateModel`,
      payload: { value, name, i }
    });
  };
  //添加、删除属性
  function updateValue(item, i, name) {
    // 分发到model
    dispatch({
      type: `${namespace}/updateValue`,
      payload: { item, i, name }
    });
  };

  let title = '新增属性'
  if (modelObj.editId + '' !== '') {
    title = '编辑属性'
  }

  //弹窗确定按钮
  function modalOk(value, name, e) {
    dispatch({
      type: `${namespace}/updatePop`,
      payload: { value, name }
    });
  };
  const modalEdit = e => {
    e.preventDefault();
    // 校验参数
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return false;
      }
      dispatch({
        type: `${namespace}/addOk`,
        payload: {}
      })
    });
  };
  //气泡确定按钮
  function okPop(value, name, e) {
    e.preventDefault();
    // 校验参数
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return false;
      }
      dispatch({
        type: `${namespace}/updatePop`,
        payload: { value, name }
      });
    })
    // 弹窗、气泡状态

  };

  const columns = [
    {
      title: '属性值',
      key: 'value',
      width: 200,
      render: (item, index, i) => {
        return <FormItem className={styles.marginNone}>
          {getFieldDecorator('value_' + i, {
            initialValue: item.value,
            rules: [
              { required: true, message: '请输入属性值' },
            ],
          })
            (<Input maxLength="40" onChange={e => updateModel(e.target.value, 'value', i)} placeholder="请输入属性值" />)
          }
        </FormItem>
      },
    }
  ];
  // 操作栏
  const ActionBar = () => {
    return {
      title: '操作',
      key: 'action',
      width: 200,
      render: (item, index, i) => {
        return (
          // obj.values.length > 0 && i + 1 === obj.values.length ?
          //   <span>
          //     <a onClick={() => { updateValue(item, i, 'add') }}>添加</a>
          //     {
          //       obj.values.length == 1 ? '' :
          //         <span>
          //           <span className={cx("ant-divider")} />
          //           <a onClick={() => { updateValue(item, i, 'del') }}>删除</a>
          //         </span>
          //     }
          //   </span>
          //   : <a onClick={() => { updateValue(item, i, 'del') }}>删除</a>
          obj.values.length > 0 && i + 1 === obj.values.length &&
          <span>
            <a onClick={() => { updateValue(item, i, 'add') }}>添加</a>
          </span>
        )
      },
    }
  };
  //'4'--下拉、'5'--文本、'6'--颜色
  if (obj.showType + '' == '6') {
    columns[1] = {
      title: '图片',
      dataIndex: 'imgUrl',
      key: 'img',
      render: (b, item, i) => {
        return <FormItem className={styles.marginNone}>
          <Uploader
            uploadSuccessCbf={imgUrl => updateModel(imgUrl, 'imgUrl', i)}
            removeFileCbf={() => updateModel('', 'imgUrl', i)}
            showType='2'
            fileType='image'
            fileMaxSize={2}
            uploadedUrls={item.imgUrl}
            uploadTip={() => {
              return <p>支持扩展名：.png .jpg .gif<br />建议尺寸: 400x250像素</p>
            }}
          />
          {/* <p>建议：图片大小不超过2MB，仅支持jpg,png格式</p>*/}
        </FormItem>
      },
    }
  }
  //modal按钮
  let footer = [
    <Button key="submit" type="primary" onClick={e => {
      dispatch({
        type: `${namespace}/setVisible`,
        payload: { visible: false }
      })
    }}>取消</Button>,
    <Popconfirm Collapse
      className={styles.poPcon}
      visible={obj.id ? popVisible : false}
      title='确定要保存吗？'
      okText='确定'
      cancelText='取消'
      onConfirm={e => okPop(false, 'popVisible', e)}
      onCancel={e => {
        dispatch({
          type: `${namespace}/updatePop`,
          payload: { value: false }
        })
      }}
    >
      <Button key="submit" type="primary" onClick={e => {
        obj.id ? modalOk(true, 'Modal') :
          modalEdit(e)
      }
      }>保存</Button>
    </Popconfirm>

  ]

  return (
    <div className={styles.wraps}>
      <Modal visible={visible}
        title={title}
        width="600px"
        footer={footer}
        onCancel={() => {
          dispatch({
            type: `${namespace}/setVisible`,
            payload: { visible: false }
          })
        }}
      >
        <Form>
          <Row>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="属性名称">
                {getFieldDecorator('name', {
                  initialValue: obj.name,
                  rules: [
                    { required: true, message: '请输入属性名称' },
                    { max: 20, message: '最大20位' },
                  ],
                })
                  (<Input placeholder="请输入属性名称" onChange={e => updateModel(e.target.value, 'name', '')} />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="属性描述">
                {getFieldDecorator('describe', {
                  initialValue: obj.statement,
                  rules: [
                    { required: false, message: '请输入属性描述' },
                    { max: 20, message: '最大20位' },
                  ],
                })
                  (<Input placeholder="请输入属性描述" onChange={e => updateModel(e.target.value, 'statement', '')} />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="显示类型">
                {getFieldDecorator('showType', {
                  initialValue: obj.showType + '',
                  rules: [
                    { required: true, message: '请输入显示类型' },
                    { max: 20, message: '最大20位' },
                  ],
                })
                  (<RadioGroup onChange={e => updateModel(e.target.value, 'showType', '')} disabled={obj.id ? true : false}>
                    <Radio value='4'>下拉</Radio>
                    <Radio value='5'>文本</Radio>
                    <Radio value='6'>颜色</Radio>
                  </RadioGroup>)
                }
              </FormItem>
            </Col>
            {/*<Col span={24}>
              <FormItem
                {...formItemLayout}
                label="是否必填">
                {getFieldDecorator('fillType', {
                  initialValue: obj.fillType+'',
                  rules: [
                    {required: true, message: '请输入别名'},
                    {max: 20, message: '最大20位'},
                  ],
                })
                (<RadioGroup onChange={e=>updateModel(e.target.value,'fillType','')}>
                  <Radio value='1'>是</Radio>
                  <Radio value='0'>否</Radio>
                </RadioGroup>)
                }
              </FormItem>
            </Col>*/}
            <Col span={24}>
              {obj.showType + '' !== '5' ?
                <Table columns={config.listConfig.columns(columns.concat(ActionBar()))}
                  dataSource={obj.values} pagination={false} /> : ''
              }
            </Col>
            <div >

            </div>
          </Row>
        </Form>
      </Modal>
      <ListPage pageProps={pageProps} />
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
