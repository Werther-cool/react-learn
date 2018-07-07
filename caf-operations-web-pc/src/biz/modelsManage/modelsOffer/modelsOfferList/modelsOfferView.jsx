import React from 'react'

import { connect } from 'dva'

import {Table, Form, Popover, message, Input, Select, Row, Col, Button, Icon, Pagination, Modal} from 'antd'

import cx from 'classnames'

import styles from './modelsOfferStyle.less'

import config from '../../../../config/config'
import {isEmpty, cloneDeep, get, isArray} from 'lodash'
// 表单域
const FormItem = Form.Item;
const { TextArea } = Input;
// 判断对象是否为空
import { Link,hashHistory } from 'dva/router'
import { mapStateToProps } from '../../../../utils/view_utils'
import ChildrenTable from "./childrenTable";
import ListPage from 'Components/PageTmpl/ListPage'

import mockdata from "./mockData";

 /**
 * 车型管理 - 车型报价列表 组件
 *
 * @author 阿九
 * @since 0.1.0
 */


const routeView = function({dispatch, model, form}) {

  const {resetFields, getFieldDecorator, validateFields, setFieldsValue} = form

  const {modelObj, namespace} = model;

  const { priceList, total, queryList} = modelObj;

  // 更新状态
  const updateModel = (value, name, objName, index) => {
    let tmpObj = {}
    if (objName) {
      if (objName == 'store') {
        tmpObj.store = get(modelObj, objName)
        tmpObj.store[index][name] = value
      } else {
        tmpObj[objName] = get(modelObj, objName)
        tmpObj[objName][name] = value
      }
    } else {
      tmpObj[name] = value
    }
    // 分发到model
    dispatch({
      type: `${namespace}/updateModel`,
      payload: tmpObj
    });
  }

  // 显示弹窗
  function showModal(id) {
    updateModel(true, 'visible')
    updateModel(id, 'id', 'modalState')
  }

  function hideModal() {
    dispatch({
      type: `${namespace}/hideModal`,
      payload: {}
    });
  }

  // 强制下架
  function force() {
    updateModel(true, 'modalLoading')
    dispatch({
      type: `${namespace}/forceOffShelf`,
      payload: {}
    });
  }

  // 显示/隐藏子列表
  function toggleChildrenTable(id) {
    let expandedRow = cloneDeep(get(modelObj, 'expandedRow'))
    let index = expandedRow.indexOf(id)
    if (index === -1) {
      expandedRow.push(id)
    } else {
      expandedRow.splice(index, 1)
    }
    updateModel(expandedRow, 'expandedRow')
  }

  let pageProps = {
    ui: {
      api_url:'caf/mgmt/items/car/offer/list-by-page',

      method:'GET',

      params: 'pageNum=1&pageSize=5',

      // mockData: mockdata,
      requestHandler: () => {
        updateModel([], 'expandedRow')
      },
      search_bar:{
        fields: [
          {
            "en_name": "dealerName",
            "zh_name": "经销商",
            "elem_type": "Input",
            "elem_valid_type": "string",
          },
          {
            "en_name": "areaCode",
            "zh_name": "地区",
            "elem_type": "Cascader",
            "elem_valid_type": "string",
            "split_keys": ['provinceCode', 'cityCode'],
            "cmpt_items": modelObj.cityTree,
          },
          {
            "en_name": "status",
            "zh_name": "状态",
            "elem_type": "Select",
            "elem_valid_type": "string",
            "cmpt_items": [
              {"label": "待上架", "value": "0"},
              {"label": "已上架", "value": "1"},
            ]
          },
          {
            "en_name": "carCode",
            "zh_name": "车型编号",
            "elem_type": "Input",
            "elem_valid_type": "string",
          },
          {
            "en_name": "carName",
            "zh_name": "车型",
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
        ]
      },
      action_bar: [],
      table: {
        "fields" : [
            {
              "en_name": "carCode",
              "zh_name": "车型规格",
              "render": (text, record, index) => {
                let data = !!record && isArray(record.children) ? record.children : []
                data.map((e, i) => {
                  e.key = i + 1
                })
                let visible = get(modelObj, 'expandedRow').includes(record.id)
                return {
                  children: <div style={{margin: '0 -7px 0 -6px', backgroundColor: '#F6F6F6'}}>
                    <div className={styles.main} >
                      <span className={styles.item}>
                        车型编号: {record.carCode}
                      </span>
                      <span className={styles.item}>
                        车型: {record.carName}
                      </span>
                      <span className={styles.item}>
                        经销商: {record.sellerName}
                      </span>
                      <span className={styles.item}>
                        分类: {record.catalogName}
                      </span>
                      <span className={styles.item}>
                        销售状态: {record.status == 1 ? '在售' : '停售'}
                      </span>
                      <span className={styles.action}>
                        <a onClick={() => {
                          hashHistory.push(`/home/modelsManage/modelOfferDetails?id=${record.id}&sellerId=${record.sellerId}`)
                        }} >查看</a>
                      </span>
                    </div>
                    {
                      data.length === 0 ? '' : <ChildrenTable
                        dataSource={data}
                        actionCbk={showModal}
                      />
                    }
                  </div>,
                  props: {
                    colSpan: 5
                  }
                }
              }
            },
            {
              "en_name": "carName",
              "zh_name": "指导价",
              "width": 100,
              "render": (text, record, index) => {
                return {
                  children: <span></span>,
                  props: {
                    colSpan: 0
                  }
                }
              }
            },
            {
              "en_name": "offerPrice",
              "zh_name": "报价",
              "width": 100,
              "render": (text, record, index) => {
                return {
                  children: <span></span>,
                  props: {
                    colSpan: 0
                  }
                }
              }
            },
            // {
            //   "en_name": "lowPrice",
            //   "zh_name": "底价",
            //   "width": 100,
            //   "render": (text, record, index) => {
            //     return {
            //       children: <span></span>,
            //       props: {
            //         colSpan: 0
            //       }
            //     }
            //   }
            // },
            {
              "en_name": "status",
              "zh_name": "状态",
              "width": 100,
              "render": (text, record, index) => {
                return {
                  children: <span></span>,
                  props: {
                    colSpan: 0
                  }
                }
              }
            },
            {
              "en_name": "action",
              "zh_name": "操作",
              "width": 100,
              "render": (text, record, index) => {
                return {
                  children: <span></span>,
                  props: {
                    colSpan: 0
                  }
                }
              }
            },
        ],
        "extProps": {
          childrenColumnName: 'disableChildren' + Math.random()
        },
        // 表格操作
        "actions": [
          // {
          //   "func_name" : "onAudit",
          //   "label" : "使用Render",
          //   "render" : (item) => {
          //       let divider = <span className='ant-divider'/>
          //       let text = item.status==0?'发布':'停售';

          //       let detail = <Link to={'/home/modelsManage/modelDetails?id=' + item.id}>查看</Link>;

          //       let content = (item) => {
          //         return (<div>
          //            <p><Popconfirm title={`确定要${text}吗？`} okText='确定' cancelText='取消' onConfirm={() => dispatch({ type:`${namespace}/updateModelStatus`,payload:{ id: item.id, status: item.status }})}>
          //                       <Link>{text}</Link>
          //           </Popconfirm></p>
          //           <p>
          //           <Link to={'/home/modelsManage/editModel?id=' + item.id}>编辑</Link></p>
          //         </div>)
          //       }

          //       let more = <Popover content={content(item)} placement="bottom"><Link>更多</Link></Popover>

          //       return <div>{detail}{divider}{more}</div>;
          //   }
          // }
        ]
      }
    }
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
    <div className="public_listMain">
      <Modal
        title="备注"
        visible={modelObj.visible}
        confirmLoading={modelObj.modalLoading}
        onOk={() => force()}
        onCancel={() => hideModal()}
      >
        <TextArea
          value={get(modelObj, 'modalState.remark')}
          onChange={e => updateModel(e.target.value, 'remark', 'modalState')}
          autosize={{minRows: 5}}
        />
      </Modal>
      <div className={styles.offerList}>
        <ListPage pageProps={pageProps}/>
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(Form.create()(routeView))
