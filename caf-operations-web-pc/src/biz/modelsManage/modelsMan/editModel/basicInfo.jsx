// React基础组件
import React from 'react'
import cx from 'classnames'
// dva 连接组件 - 连接route和model
import { connect } from 'dva'
import { CustomCard } from '../../../../components/Grid/index'
// 引入antd的组件
import { Form, Input, Row, Col, Checkbox, Select, Button, Table, Popconfirm, TreeSelect, message } from 'antd'
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option

//导入路由组件，用于跳转等
import { Link, hashHistory } from 'dva/router'
// 导入项目全局配置文件
import config from '../../../../config/config'
import { get, cloneDeep, pick } from "lodash";
// 引入model取值工具方法
import { mapStateToProps } from '../../../../utils/view_utils'
// 当前组件样式
import styles from './editModelStyle.less'
// 引入校验
import Verify from "../../../common/verify/index";
// 引入上传组件
import Uploader from '../../../../components/Upload'
import { CollapsiblePanels } from "../../../../components/CollapsiblePanels";
import EditedTable from "./editedTable";


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const colLayout = {
  xs: { span: 24 },
  sm: { span: 22 },
  md: { span: 20 },
  lg: { span: 18 },
  xl: { span: 16 },
}

const routeView = function ({ dispatch, model, form, changeCbk }) {
  // 表单的子函数
  const { resetFields, getFieldDecorator, validateFields, setFieldsValue } = form
  // 取出model对象，命名空间
  const { modelObj, namespace } = model

  // 校验函数
  // 特殊字符校验
  function validatorSpecialStr(name, rule, value, callback) {
    if (Verify.hasSpecialCharacter(value)) {
      callback(name + '输入格式不正确')
    } else {
      callback()
    }
  }
  // 只允许数字
  function validatorNumberOnly(name, rule, value, callback) {
    if (Verify.numberOnly(value)) {
      callback(name + '输入格式不正确')
    } else {
      callback()
    }
  }
  // 只允许字母和数字
  function validatorAlphaAndNumOnly(name, rule, value, callback) {
    if (Verify.alphabetAndNumber(value)) {
      callback(name + '输入格式不正确')
    } else {
      callback()
    }
  }

  // 点击处理事件
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

  // 添加门店
  function addStore() {
    dispatch({
      type: `${namespace}/addStore`,
      payload: {}
    });
  }

  // 提交并进入下一步
  function nextStep() {
    validateFields([
      'catalogId',
      'brandId',
      'carCode',
      'carName',
      'imgUrl',
    ], {}, (err, values) => {
      if (!err) {
        let skus = get(modelObj, 'skus')
        let tmpArr = []
        for (let i = 0; i < skus.length; i++) {
          const sku = skus[i];
          let speString = ''
          for (let j = 0; j < sku.specifications.length; j++) {
            const spe = sku.specifications[j];
            if (!spe.valueId) {
              message.error(`规格编号${sku.code}的销售属性不能为空!`)
              return false
            }
            speString += spe.valueId
          }
          tmpArr.push(speString)
          if (!sku.guidePrice) {
            message.error(`规格编号${sku.code}的指导价不能为空!`)
            return false
          }
        }
        // 对tmpArr去重, 判断长度是否变化, 若变化则有重复
        let judgeArr = Array.from(new Set(tmpArr))
        if (judgeArr.length !== tmpArr.length) {
          message.error(`不同规格编号的车型, 销售属性不能完全相同!`)
          return false
        }
        changeCbk('detailInfo')
        dispatch({
          type: `${namespace}/generateData`,
          payload: {}
        });
      }
    })
  }

  // 获取属性组
  function getPropGroup(id) {
    dispatch({
      type: `${namespace}/getPropGroup`,
      payload: {
        id
      }
    });
  }

  // 车型规格新增一行
  function handleAdd() {
    dispatch({
      type: `${namespace}/handleAdd`,
      payload: {}
    });
  }

  // 车型规格删除一行
  function handleDelete(index) {
    dispatch({
      type: `${namespace}/handleDelete`,
      payload: {
        index
      }
    });
  }

  // 激活规格表格
  function activateTable() {
    updateModel(true, 'activateFlag')
    setTimeout(() => {
      updateModel(false, 'activateFlag')
    }, 5000);
  }

  // 获取到详情后再插入规格表格
  function insertTable() {
    if (get(modelObj, 'detailLoading')) {
      return ''
    } else {
      return <EditedTable
        dataSource={get(modelObj, 'skus')}
        catalogId={get(modelObj, 'catalogId')}
        updateFlag={get(modelObj, 'activateFlag')}
        editable={true}
        dataCbk={(data, initFlag) => {
          if (initFlag) {
            // 从detailInfo返回basicInfo 或 也换别的页面再回来时, 通过外部props变化激活表格
            activateTable()
            if (get(modelObj, 'skus').length === 0 || !get(modelObj, 'skus')) {
              // console.log('init', data, get(modelObj, 'skus'))
              // initFlag为true标识目前为初始化数据,
              // 检查当前skus为null或空数组时才保存数据,
              updateModel(data, 'skus')
            }
          } else {
            // 不是初始化的数据则直接保存
            // console.log('save', data)
            updateModel(data, 'skus')
          }
        }}
      />
    }
  }

  return (
    <div className="boxShadow">
      <CustomCard title='基本信息'>
        <Row>
          <Col {...colLayout}>
            <Row>
              <Col span={12}>
                <FormItem label={'分类'} {...formItemLayout}>
                  {
                    getFieldDecorator('catalogId', {
                      initialValue: get(modelObj, 'catalogId'),
                      trigger: 'onSelect',
                      rules: [
                        { required: true, message: '分类不能为空' },
                      ]
                    })
                      (
                      <TreeSelect
                        style={{ width: 300 }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={get(modelObj, 'catalogTree')}
                        placeholder="请选择"
                        treeDefaultExpandAll
                        disabled={!!get(modelObj, 'id')}
                        onSelect={(key, l, x) => {
                          // console.log(key, l, x)
                          getPropGroup(key)
                          updateModel(key, 'catalogId')
                        }}
                      />
                      )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={'品牌'} {...formItemLayout}>
                  {
                    getFieldDecorator('brandId', {
                      initialValue: get(modelObj, 'brandId') + '',
                      rules: [
                        { required: true, message: '品牌不能为空' },
                      ]
                    })
                      (
                      <Select
                        onChange={e => updateModel(e, 'brandId')}
                      >
                        <Option value=''>请选择</Option>
                        {
                          get(modelObj, 'brandList').map((e, i) => {
                            return <Option
                              key={'brandOp_' + i + 1}
                              value={e.id + ''}
                            >{e.name}</Option>
                          })
                        }
                      </Select>
                      )
                  }
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <Row>
              <Col span={12}>
                <FormItem label={'车型编号'} {...formItemLayout}>
                  {
                    getFieldDecorator('carCode', {
                      initialValue: get(modelObj, 'carCode'),
                      rules: [
                        { required: true, message: '车型编号不能为空' },
                        { max: 20, message: '车型编号长度不能超过20个字符!' },
                        // { validator: (rule, value, callback) => validatorSpecialStr("车型编号", rule, value, callback) },
                      ]
                    })
                      (
                      <Input
                        disabled={!!get(modelObj, 'id')}
                        onChange={e => updateModel(e.target.value, 'carCode')}
                        placeholder="请输入车型编号"
                      />
                      )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={'车型名称'} {...formItemLayout}>
                  {
                    getFieldDecorator('carName', {
                      initialValue: get(modelObj, 'carName'),
                      rules: [
                        { required: true, message: '车型名称不能为空' },
                        { max: 50, message: '车型名称长度不能超过50个字符!' },
                        // { validator: (rule, value, callback) => validatorSpecialStr("车型名称", rule, value, callback) },
                      ]
                    })
                      (
                      <Input
                        onChange={e => updateModel(e.target.value, 'carName')}
                        placeholder="请输入车型名称"
                      />
                      )
                  }
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <FormItem label={'标签'} {...{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }}>
              {
                getFieldDecorator('labelIds', {
                  initialValue: get(modelObj, 'labelIds').map(e => e + ''),
                  rules: [
                    // { required: true, message: '车型名称不能为空'},
                    // { validator: (rule, value, callback) => validatorSpecialStr("车型名称", rule, value, callback) },
                  ]
                })
                  (
                  <CheckboxGroup
                    options={get(modelObj, 'labelList')}
                    onChange={value => {
                      updateModel(value, 'labelIds')
                    }}
                  />
                  )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <FormItem label={'车型主图'} {...{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }}>
              {
                getFieldDecorator('imgUrl', {
                  initialValue: get(modelObj, 'imgUrl'),
                  trigger: 'uploadSuccessCbf',
                  rules: [
                    { required: !(/(dev)$/.test(config.baseURL)), message: '车型主图不能为空' },
                  ]
                })
                  (
                  <Uploader
                    uploadSuccessCbf={imgUrl => {
                      updateModel(imgUrl, 'imgUrl')
                    }}
                    fileMaxSize={2}
                    removeFileCbf={() => updateModel('', 'imgUrl')}
                    showType='2'
                    fileType='image'
                    uploadedUrls={[get(modelObj, 'imgUrl', '').split('?')[0]]}
                    // imgUrlSize="?x-oss-process=image/resize,m_pad,h_250,w_400,color_FFFFFF"
                    uploadTip={() => {
                      return <p>支持扩展名：.png .jpg .gif<br />建议尺寸: 400x250像素</p>
                    }}
                  />
                  )
              }
              <p className={styles.introduce} >图片建议尺寸：1500x760px</p>
              <p className={styles.introduce} >建议大小：200kb</p>
              <p className={styles.introduce} >图片格式：jpg,png</p>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <FormItem label={'车型缩略图'} {...{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }}>
              {
                getFieldDecorator('thumbnailUrl', {
                  initialValue: get(modelObj, 'thumbnailUrl'),
                  trigger: 'uploadSuccessCbf',
                  rules: [
                    { required: !(/(dev)$/.test(config.baseURL)), message: '车型缩略图不能为空' },
                  ]
                })
                  (
                  <Uploader
                    uploadSuccessCbf={imgUrl => {
                      updateModel(imgUrl, 'thumbnailUrl')
                    }}
                    fileMaxSize={2}
                    removeFileCbf={() => updateModel('', 'thumbnailUrl')}
                    showType='2'
                    fileType='image'
                    uploadedUrls={[get(modelObj, 'thumbnailUrl', '')]}
                    // imgUrlSize="?x-oss-process=image/resize,m_pad,h_250,w_400,color_FFFFFF"
                    uploadTip={() => {
                      return <p>支持扩展名：.png .jpg .gif<br />建议尺寸: 400x250像素</p>
                    }}
                  />
                  )
              }
              <p className={styles.introduce} >图片建议尺寸：630x520px</p>
              <p className={styles.introduce} >建议大小：50kb</p>
              <p className={styles.introduce} >图片格式：jpg,png</p>
            </FormItem>
          </Col>
        </Row>

      </CustomCard>
      <CustomCard title='车型规格'>
        {
          insertTable()
        }
      </CustomCard>

      <Row className={cx('txtcenter', 'mg1b', 'mg2t')}>
        <Button onClick={closeTab} className="mg2r">返回</Button>
        <Button type="primary" onClick={nextStep}>下一步</Button>
      </Row>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
