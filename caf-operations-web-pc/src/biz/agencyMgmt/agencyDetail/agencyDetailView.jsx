// React基础组件
import React from 'react'
import cx from 'classnames'
// dva 连接组件 - 连接route和model
import { connect } from 'dva'
import { CustomCard } from '../../../components/Grid/index'
// 基础表格
import BasicTable from '../../../components/BasicTable'
// 引入antd的组件
import { Form, Input, Row, Col, Checkbox, Select, Button } from 'antd'
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option

//导入路由组件，用于跳转等
import { Link, hashHistory } from 'dva/router'
// 导入项目全局配置文件
import config from '../../../config/config'
import { get } from "lodash";
// 引入model取值工具方法
import { mapStateToProps } from '../../../utils/view_utils'
// 当前组件样式
import styles from './agencyDetailStyle.less'


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const colLayout = {
  xs: { span: 22 },
  sm: { span: 20 },
  md: { span: 20 },
  lg: { span: 16 },
  xl: { span: 12 },
}


 /**
 * 经销商管理 - 经销商详情 组件
 *
 * @author 阿九
 * @since 0.1.0
 */
const routeView = function({dispatch, model, form}) {
  // 表单的子函数
  const {resetFields, getFieldDecorator, validateFields, setFieldsValue} = form
  // 取出model对象，命名空间
  const { modelObj, namespace } = model

  // 状态值变化
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

  // 关闭标签页并返回上级目录
  function closeTab() {
    dispatch({
      type: `${namespace}/closeTab`,
      payload: {}
    });
  }

  let basicInfo = {
    ui: {
      table_data: modelObj,
      // 字段列表
      columns:2,
      fields: [
        {
          // 接口结果集中的字段名
          en_name: 'code',
          // label显示字段名
          zh_name: '经销商编号',
        },
        {
          en_name: 'dealerName',
          zh_name: '经销商名称',
        },
        {
          en_name: 'aliasName',
          zh_name: '经销商简称',
        },
        {
          en_name: 'brands',
          zh_name: '经营品牌',
          render:(record) => {
            return <div>
              {
                record && record.map((obj,idx) => {
                  return <span key={idx}>{obj.name},</span>
                })
              }
            </div>
          }
        },
        {
          en_name: 'status',
          zh_name: '经营状态',
          render:(record) => {
            if(record === 1){return <span>营业</span>}
            if(record === 3){return <span>停业</span>}
            if(record === 4){return <span>在建</span>}
            if(record === 5){return <span>取消</span>}
          }
        },
        {
          en_name: 'city',
          zh_name: '所属地区',
          render:(record) => {
            return <span>{modelObj.provinceName}{modelObj.cityName}{modelObj.districtName}</span>
          }
        },
        {
          en_name: 'postCode',
          zh_name: '邮编',
        },
        {
          en_name: 'areaCode',
          zh_name: '电话区号',
        },
        {
          en_name: 'salePhone',
          zh_name: '销售热线',
        },
        {
          en_name: 'faxPhone',
          zh_name: '传真',
        },
      ]
    }
  }

  return (
    <div className="public_listMain">
      <div className="boxShadow" style={{ position: 'relative' }}>
      <div className={styles.qrCode}>
						<img src={modelObj.qrCode + '?x-oss-process=image/resize,m_pad,h_180,w_180,color_E6E6E6'} alt="" />
						<div className={styles.downloadBtn} >
							<a onClick={() => { window.open(modelObj.qrCode) }}>下载</a>
						</div>
					</div>
        <CustomCard title='基本信息'>
          <Row>
            <Col span={16}>
              <BasicTable tableProps={ basicInfo }/>
            </Col>
            <Col span={8}></Col>
          </Row>
        </CustomCard>
        <CustomCard title='证件信息'>
        <Row>
            <Col {...colLayout}>
              <FormItem label={'门店照片'} {...formItemLayout}>
                <img src={get(modelObj, 'fileUrl')}/>
                {/* <img src={get(modelObj, 'businessLicensePictureBackUrl')}/> */}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <FormItem label={'营业执照'} {...formItemLayout}>
                <img src={get(modelObj, 'businessLicensePictureFrontUrl')}/>
                {/* <img src={get(modelObj, 'businessLicensePictureBack')}/> */}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <FormItem label={'身份证(正面)'} {...formItemLayout}>
                <img src={get(modelObj, 'identityCardPictureFrontUrl')}/>
                {/* <img src={get(modelObj, 'identityCardPictureBackUrl')}/> */}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <FormItem label={'身份证(反面)'} {...formItemLayout}>
                {/* <img src={get(modelObj, 'identityCardPictureFrontUrl')}/> */}
                <img src={get(modelObj, 'identityCardPictureBackUrl')}/>
              </FormItem>
            </Col>
          </Row>
        </CustomCard>
        <CustomCard title='门店信息'>
          {
            get(modelObj, 'shops').map((e, index) => {
              let storeInfo = {
                ui: {
                  table_data: modelObj.shops[index],
                  // 字段列表
                  fields: [
                    {
                      en_name: 'name',
                      zh_name: '门店名称',
                    },
                    {
                      en_name: 'address',
                      zh_name: '门店地址',
                    },
                    {
                      en_name: 'longitude',
                      zh_name: '门店经度',
                    },
                    {
                      en_name: 'latitude',
                      zh_name: '门店纬度',
                    },
                  ]
                }
              }
              return <BasicTable key={e.key} tableProps={ storeInfo }/>
            })
          }
        </CustomCard>
        <Row className={cx('txtcenter', 'mg1b', 'mg2t')}>
          <Button onClick={closeTab}>返回列表</Button>
        </Row>
      </div>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
