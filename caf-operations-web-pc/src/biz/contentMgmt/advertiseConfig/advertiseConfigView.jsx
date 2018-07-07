// React基础组件
import React from 'react'
import cx from 'classnames'
// dva 连接组件 - 连接route和model
import { connect } from 'dva'
// 引入antd的组件
import { Form, Input, Row, Col, Select, Button, Tabs, Modal, Pagination, Carousel, Radio } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane
const { TextArea } = Input
const RadioGroup = Radio.Group

import ImgCell from "./imgCell";
import { CollapsiblePanels } from "../../../components/CollapsiblePanels";
// 引入上传组件
import Uploader from '../../../components/Upload'

//导入路由组件，用于跳转等
import { Link, hashHistory } from 'dva/router'
// 导入项目全局配置文件
import config from '../../../config/config'
import { get, isArray } from "lodash";
// 引入model取值工具方法
import { mapStateToProps } from '../../../utils/view_utils'
// 当前组件样式
import styles from './advertiseConfigStyle.less'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const colLayout = {
  xs: { span: 22 },
  sm: { span: 20 },
  md: { span: 20 },
  lg: { span: 16 },
  xl: { span: 12 },
}

 /**
 * 内容管理 - 广告位设置 组件
 *
 * @author 阿九
 * @since 0.1.0
 */
const routeView = function({dispatch, model, form}) {
  // 表单的子函数
  const {resetFields, getFieldDecorator, validateFields, setFieldsValue} = form
  // 取出model对象，命名空间
  const { modelObj, namespace } = model
  const { type, advertiseList } = modelObj
  // 状态值变化
  const updateModel = (value, name, objName, index) => {
    let tmpObj = {}
    if (objName) {
      if (index !== undefined) {
        tmpObj[objName] = get(modelObj, objName)
        tmpObj[objName][index][name] = value
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

  const videoCol = [
    {
      title: '视频名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分组',
      dataIndex: 'groupId',
      key: 'groupId',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record, index) => {
        return (
          <div>
            <a>复制链接</a>
            <span className="ant-divider"></span>
            <a>编辑</a>
            <span className="ant-divider"></span>
            <a>删除</a>
          </div>
        )
      }
    },
  ]

  const fileCol = [
    {
      title: '文件名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '分组',
      dataIndex: 'groupId',
      key: 'groupId',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record, index) => {
        return (
          <div>
            <a>下载</a>
            <span className="ant-divider"></span>
            <a>编辑</a>
            <span className="ant-divider"></span>
            <a>删除</a>
          </div>
        )
      }
    },
  ]

  // 关闭标签页并返回上级目录
  function closeTab() {
    dispatch({
      type: `${namespace}/closeTab`,
      payload: {}
    });
  }

  // 新增广告
  function addAd() {
    dispatch({
      type: `${namespace}/addAd`,
      payload: {}
    });
  }

  // 删除广告
  function deleteAd(advertiseId) {
    dispatch({
      type: `${namespace}/deleteAd`,
      payload: {
        advertiseId
      }
    });
  }

  // imgCell的回调
  function imgCellCbk(id, action, name, value, index) {
    if (action === 'edit') {
      console.log(index, ' will ', action, name, value)
      updateModel(value, name, 'advertiseList', index)
    } else if (action === 'download') {
      console.log(index, ' will ', action)
    } else if (action === 'add') {
      addAd()
    } else {
      deleteAd(id)
    }
  }

  // 切换Tab
  function changeTab(key) {
    dispatch({
      type: `${namespace}/getAdList`,
      payload: {
        type: key
      }
    })
  }

  // 保存配置
  function saveConfig() {
    dispatch({
      type: `${namespace}/saveConfig`,
      payload: {}
    });
  }

  return (
    <div className="public_listMain">
      <div className='boxShadow'>
        <Row>
          <Col span={24}>
            <Tabs
              tabPosition="buttom"
              activeKey={ type }
              onChange={ changeTab }
              type='card'
            >
              <TabPane tab="特惠车-轮播图" key="1">
              <Row>
                  <Col span={20} offset={2}>
                    <p className={styles.introduce} >图片建议尺寸：1500x660px</p>
                    <p className={styles.introduce} >建议大小：200kb</p>
                    <p className={styles.introduce} >图片格式：jpg,png</p>
                  </Col>
                </Row>

                {
                  !!advertiseList && isArray(advertiseList) && advertiseList.map((item, index) => {
                    return <div key={'adRow_' + (index + 1)}>
                      <ImgCell
                        imgProps={item}
                        actionCbk={(imgId, action, name, value) => imgCellCbk(imgId, action, name, value, index)}
                        showAdd={index === advertiseList.length - 1}
                        carList={modelObj.carList}
                      />
                    </div>
                  })
                }

                <Row className={cx('txtcenter', 'mg1b', 'mg2t')}>
                  <Button type="primary" onClick={saveConfig} >确定</Button>
                </Row>
              </TabPane>
              {/* <TabPane tab="我的消息-轮播图" key="2">
                <Row>
                  <Col span={20} offset={2}>
                    <p className={styles.introduce} >说明：图片建议尺寸：××*×××，仅支持jpg,png格式</p>
                  </Col>
                </Row>

                {
                  !!advertiseList && isArray(advertiseList) && advertiseList.map((item, index) => {
                    return <div key={'adRow_' + (index + 1)}>
                      <ImgCell
                        imgProps={item}
                        actionCbk={(imgId, action, name, value) => imgCellCbk(imgId, action, name, value, index)}
                        showAdd={index === advertiseList.length - 1}
                        carList={modelObj.carList}
                      />
                    </div>
                  })
                }

                <Row className={cx('txtcenter', 'mg1b', 'mg2t')}>
                  <Button type="primary" onClick={saveConfig} >确定</Button>
                </Row>
              </TabPane> */}
              <TabPane tab="活动-轮播图" key="3">
              <Row>
                  <Col span={20} offset={2}>
                    <p className={styles.introduce} >图片建议尺寸：1500x660px</p>
                    <p className={styles.introduce} >建议大小：200kb</p>
                    <p className={styles.introduce} >图片格式：jpg,png</p>
                  </Col>
                </Row>

                {
                  !!advertiseList && isArray(advertiseList) && advertiseList.map((item, index) => {
                    return <div key={'adRow_' + (index + 1)}>
                      <ImgCell
                        imgProps={item}
                        actionCbk={(imgId, action, name, value) => imgCellCbk(imgId, action, name, value, index)}
                        showAdd={index === advertiseList.length - 1}
                        carList={modelObj.carList}
                      />
                    </div>
                  })
                }

                <Row className={cx('txtcenter', 'mg1b', 'mg2t')}>
                  <Button type="primary" onClick={saveConfig} >确定</Button>
                </Row>

              </TabPane>
              {/* <TabPane tab="我的-banner图" key="4">
                <Row>
                  <Col span={20} offset={2}>
                    <p className={styles.introduce} >说明：图片建议尺寸：××*×××，仅支持jpg,png格式</p>
                  </Col>
                </Row>

                {
                  !!advertiseList && isArray(advertiseList) && advertiseList.map((item, index) => {
                    return <div key={'adRow_' + (index + 1)}>
                      <ImgCell
                        imgProps={item}
                        actionCbk={(imgId, action, name, value) => imgCellCbk(imgId, action, name, value, index)}
                        hideActionBar={true}
                        carList={modelObj.carList}
                      />
                    </div>
                  })
                }

                <Row className={cx('txtcenter', 'mg1b', 'mg2t')}>
                  <Button type="primary" onClick={saveConfig} >确定</Button>
                </Row>
              </TabPane> */}
            </Tabs>
          </Col>
        </Row>
      </div>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
