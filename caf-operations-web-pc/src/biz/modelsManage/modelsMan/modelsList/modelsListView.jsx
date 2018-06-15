/**
 * @(#)modelsListView.jsx 0.1.0 2018-03-17
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import React from 'react';
// dva 连接组件 - 连接route和model
import { connect } from 'dva';
// 选项卡、表格、弹出确认框
import { Tabs, Form, Popover, message, Input, Select, Row, Col, Button, InputNumber, TreeSelect, Popconfirm, Icon } from 'antd';
// 获取样式类名
import cx from 'classnames'
// 当前页面样式
import styles from './modelsListStyle.less'
import config from '../../../../config/config'
import { isEmpty, cloneDeep, get } from 'lodash'
// 表单域
const FormItem = Form.Item;
// 判断对象是否为空
import { Link, hashHistory } from 'dva/router'
import { mapStateToProps } from '../../../../utils/view_utils'
import { numberFormat } from 'Utils/dataFormat';

import ListPage from '../../../../components/PageTmpl/ListPage'
/**
 * description 路由视图及事件处理
 * dispatch 分发到models中的effects对应事件名
 * model 用于获取models中state定义的数据
 * form 表单对象
 */
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
/**
* 车型管理列表 组件
*
* @author 扬帆
* @since 0.1.0
*/

const routeView = function ({ dispatch, model, form }) {
  // 表单的子函数
  const { resetFields, getFieldDecorator, validateFields, setFieldsValue } = form

  const { modelObj, namespace, buttons } = model
  let pageProps = {
    ui: {
      api_url: 'caf/mgmt/items/car/list-by-page',

      method: 'GET',

      params: 'pageNum=1&pageSize=10',

      mockData: null,

      search_bar: {
        fields: [
          {
            "en_name": "carCode",
            "zh_name": "车型编号",
            "elem_type": "Input",
            "elem_valid_type": "string",
          },
          {
            "en_name": "carName",
            "zh_name": "车型名称",
            "elem_type": "Input",
            "elem_valid_type": "string",
          },
          {
            "en_name": "catalogId",
            "zh_name": "分类",
            "elem_type": "TreeSelect",
            "elem_valid_type": "string",
            "cmpt_items": modelObj.catalogTree,
          },
          {
            "en_name": "brandId",
            "zh_name": "品牌",
            "elem_type": "Select",
            "elem_valid_type": "string",
            "cmpt_items": modelObj.brandList,
          },
          {
            "en_name": "status",
            "zh_name": "销售状态",
            "elem_type": "Select",
            "elem_valid_type": "string",
            "cmpt_items": [
              { "label": "停售", "value": "0" },
              { "label": "在售", "value": "1" }
            ],
          },
          // {
          //   "en_name": "labelId",
          //   "zh_name": "标签",
          //   "elem_type": "Select",
          //   "elem_valid_type": "string",
          //   "cmpt_items": [
          //     {"label": "标签1", "value": "0"},
          //     {"label": "标签2", "value": "1"}
          //   ],
          // },
        ]
      },
      action_bar: [
        {
          "func_name": 'onAdd',
          "label": "新增车型",
          "type": "primary",
          "icon": "plus",
          "onClick": (e) => {
            hashHistory.push('/home/modelsManage/editModel')
          }
        }
      ],
      table: {
        "fields": [
          {
            "en_name": "carCode",
            "zh_name": "车型编号",
          },
          {
            "en_name": "carName",
            "zh_name": "车型名称",
          },
          {
            "en_name": "catalogName",
            "zh_name": "分类",
          },
          {
            "en_name": "labelText",
            "zh_name": "标签",
          },
          {
            "en_name": "guidePrice",
            "zh_name": "指导价",
            "render": (text, item) => {
              return <span>{numberFormat(item.minGuidePrice) + '~' + numberFormat(item.maxGuidePrice)}</span>
            }
          },
          {
            "en_name": "status",
            "zh_name": "销售状态",
            "render": (text) => {
              return text == 1 ? '在售' : '停售';
            }
          }
        ],
        // 表格操作
        "actions": [
          {
            "func_name": "onAudit",
            "label": "使用Render",
            "render": (record) => {
              let divider = <span className='ant-divider' />
              let detail = <Link to={'/home/modelsManage/modelDetails?id=' + record.id}>查看</Link>;
              let enable = <Popconfirm title="确定要发布吗？" onConfirm={() => toggleStatus(record.id, record.status)}>
                <Link>发布</Link>
              </Popconfirm>
              let disable = <Popconfirm title="确定要停售吗？" onConfirm={() => toggleStatus(record.id, record.status)}>
                <Link>停售</Link>
              </Popconfirm>
              let edit = <Link to={'/home/modelsManage/editModel?id=' + record.id}>编辑</Link>;
              if (record.status == 0) {
                return <div>{buttons.includes('detail') && detail}{buttons.includes('detail') && divider}{buttons.includes('submit') && enable}{buttons.includes('edit') && divider}{buttons.includes('edit') && edit}</div>;
              } else {
                return <div>{buttons.includes('detail') && detail}{buttons.includes('detail') && divider}{buttons.includes('halt') && disable}</div>
              }
            }
          }
        ]
      }
    }
  }

  // 停售/发布
  function toggleStatus(id, curStatus) {
    dispatch({
      type: `${namespace}/toggleStatus`,
      payload: {
        id,
        status: curStatus == 0 ? 1 : 0
      }
    })
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

  return (
    <div className="public_listMain">
      <ListPage pageProps={pageProps} />
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
