// React基础组件
import React from 'react'
import cx from 'classnames'
// dva 连接组件 - 连接route和model
import { connect } from 'dva'
import { CustomCard } from '../../../../components/Grid/index'
// 引入antd的组件
import { Form, Input, Row, Col, Checkbox, Select, Button, Table, Popconfirm, Tabs, message } from 'antd'
import { isArray } from "lodash";
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option
const TabPane = Tabs.TabPane

//导入路由组件，用于跳转等
import { Link, hashHistory } from 'dva/router'
// 导入项目全局配置文件
import config from '../../../../config/config'
import { get } from "lodash";
// 引入model取值工具方法
import { mapStateToProps } from '../../../../utils/view_utils'
// 当前组件样式
import styles from './editModelStyle.less'
// 引入校验
import Verify from "../../../common/verify/index";
// 引入上传组件
import Uploader from '../../../../components/Upload'
import { CollapsiblePanels } from "../../../../components/CollapsiblePanels";
import Editor from '../../../../components/Editor'
import PropsTab from "./propsTab";


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

const videoFormItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
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
  const { resetFields, getFieldDecorator, validateFields, setFieldsValue, validateFieldsAndScroll } = form
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

  // 富文本长度校验
  function validatorRichText(name, rule, value, callback) {
    if (!!value && Verify.richTextLength(value) > 50000) {
      callback(name + '长度不能超过50000个字符!')
    } else {
      callback()
    }
  }

  // 点击处理事件
  const updateModel = (value, name, objName, index, groupId) => {
    let tmpObj = {}
    if (objName) {
      if (objName == 'propGroups') {
        if (isArray(name)) {
          tmpObj.propGroups = get(modelObj, objName)
          name.map((e, i) => {
            tmpObj.propGroups[index].propArray[groupId][e] = value[i]
          })
        } else {
          tmpObj.propGroups = get(modelObj, objName)
          console.log(value, name, objName, index, groupId)
          tmpObj.propGroups[index].propArray[groupId][name] = value
        }
      } else if (index !== undefined) {
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

  // 进入上一步
  function prevStep() {
    changeCbk('basicInfo')
  }

  // 保存
  function saveCar(opsType) {
    validateFieldsAndScroll([
      'remark',
    ], {}, (err, values) => {
      if (!err) {
        updateModel(true, 'saveLoading')
        dispatch({
          type: `${namespace}/saveCar`,
          payload: {
            opsType
          }
        });
      } else {
        message.error('车型介绍长度不能超过3000个字符!')
      }
    })
  }

  // propTab组件的回调
  function updateProp(id, propGroup) {
    let tmpObj = {}
    tmpObj.propGroups = get(modelObj, 'propGroups') || {}
    tmpObj.propGroups[id] = propGroup
    dispatch({
      type: `${namespace}/updateModel`,
      payload: tmpObj
    });
  }

  // 上传图片保存
  function updateImg(url, listName, index, sort) {
    dispatch({
      type: `${namespace}/updateImg`,
      payload: {
        url,
        listName,
        index,
        sort
      }
    });
  }

  // 导入属性
  function importProp(fileUrl) {
    console.log('file upload', fileUrl)
    dispatch({
      type: `${namespace}/importProp`,
      payload: {
        fileUrl
      }
    });
  }

  // 导出属性
  function exportProp() {
    dispatch({
      type: `${namespace}/exportProp`,
      payload: {}
    });
  }

  return (
    <div className="boxShadow">
      {
        get(modelObj, 'curTabKey') === '0' && <div className={styles.exportBar}>
          <Button onClick={exportProp} type='primary' className='mg2r'>导出模板</Button>
          <Uploader
            uploadSuccessCbf={imgUrl => importProp(imgUrl)}
            // removeFileCbf={i => updateImg('', 'exteriorImgs', index, i)}
            render={() => <Button type='primary'>导入</Button>}
            fileMaxSize={10}
            fileType='file'
            showType='4'
            className=''
            // uploadedUrls={get(modelObj, `imgs[${index}].exteriorImgs`)}
            // imgUrlSize="?x-oss-process=image/resize,m_pad,h_250,w_400,color_FFFFFF"
            uploadTip={() => {
              return <p></p>
            }}
          />
        </div>
      }
      <Tabs
        // tabPosition="buttom"
        defaultActiveKey="0"
        // activeKey={ this.state.biz.currTabKey }
        onChange={e => updateModel(e, 'curTabKey')}
        type='card'
      >
        <TabPane tab="属性详情" key="0">
          <div className={styles.innerTab}>
            <Tabs
              tabPosition="left"
              defaultActiveKey="0"
              animated={false}
            // activeKey={ this.state.biz.currTabKey }
            // onChange={ e => this.setCurrTabKey(e) }
            // type='card'

            >
              {
                !!get(modelObj, 'propGroupList') && get(modelObj, 'propGroupList').map((item, index) => {
                  return <TabPane tab={item.groupName} key={index + ''}>
                    <PropsTab
                      propList={item}
                      propData={get(modelObj, `propGroups[${item.groupId}]`)}
                      dataCbk={(id, data) => {
                        updateProp(id, data)
                      }}
                      form={form}
                    />
                    {/* {
                      item.props.map(prop => {
                        if (prop.type == 4) {
                          return <Row key={'row_' + prop.propId + Math.random()}>
                            <Col {...colLayout}>
                              <FormItem label={prop.propName} {...formItemLayout}>
                                <Select
                                  value={get(modelObj, `propGroups[${item.groupId}].propArray[${prop.propId}].valueId`, '')}
                                  onSelect={(e, n) => updateModel([e, n.props.children], ['valueId', 'values'], 'propGroups', item.groupId, prop.propId)}
                                >
                                  <Option value=''>请选择</Option>
                                  {
                                    prop.values.map(e => <Option
                                      key={'op_' + e.id}
                                      value={e.id}>{e.name}</Option>
                                    )
                                  }
                                </Select>
                              </FormItem>
                            </Col>
                          </Row>
                        } else if (prop.type == 5) {
                          return <Row key={'row_' + prop.propId + Math.random()}>
                            <Col {...colLayout}>
                              <FormItem label={prop.propName} {...formItemLayout}>
                                <Input
                                  value={get(modelObj, `propGroups[${item.groupId}].propArray[${prop.propId}].values`, '')}
                                  onChange={e => updateModel([e.target.value], ['values'], 'propGroups', item.groupId, prop.propId)}
                                />
                              </FormItem>
                            </Col>
                          </Row>
                        } else {
                          return <Row key={'row_' + prop.propId + Math.random()}>
                            <Col {...colLayout}>
                              <FormItem label={prop.propName} {...formItemLayout}>
                                <Select
                                  value={get(modelObj, `propGroups[${item.groupId}].propArray[${prop.propId}].valueId`, '')}
                                  onSelect={(e, n) => updateModel([e, n.props.children], ['valueId', 'values'], 'propGroups', item.groupId, prop.propId)}
                                >
                                  <Option value=''>请选择</Option>
                                  {
                                    prop.values.map(e => <Option
                                      key={'op_' + e.id}
                                      value={e.id}>{e.name}</Option>
                                    )
                                  }
                                </Select>
                              </FormItem>
                            </Col>
                          </Row>
                        }
                      })
                    } */}
                  </TabPane>
                })
              }
            </Tabs>
          </div>
        </TabPane>
        <TabPane tab="车型介绍" key="1">
          <FormItem>
            {
              getFieldDecorator('remark', {
                rules: [
                  { validator: (rule, value, callback) => validatorRichText("车型介绍", rule, value, callback) },
                ]
              })
                (
                <Editor
                  html={get(modelObj, 'remark')}
                  onChange={(e) => { updateModel(e, 'remark') }}
                />
                )
            }
          </FormItem>

        </TabPane>
        <TabPane tab="图片配置" key="2">
          <Tabs
            tabPosition="left"
            defaultActiveKey="0"
            animated={false}
          // activeKey={ this.state.biz.currTabKey }
          // onChange={ e => this.setCurrTabKey(e) }
          // type='card'
          >
            {
              get(modelObj, 'imgs').map((item, index) => {
                let [sku] = get(modelObj, 'skus').filter(e => e.code === item.code)
                let nameList = sku.specifications.map(e => e.valueName)
                return <TabPane tab={nameList.join('-')} key={index + ''}>
                  {/* <CustomCard title='全景'>
                    <Row>
                      <Col span={4}>
                        <Uploader
                          uploadSuccessCbf={imgUrl => {
                            updateModel([imgUrl], 'panoramaImgs', 'imgs', index)
                          }}
                          removeFileCbf={() => updateModel([], 'panoramaImgs', 'imgs', index)}
                          showType='2'
                          fileMaxSize={2}
                          fileType='image'
                          uploadedUrls={get(modelObj, `imgs[${index}].panoramaImgs`)}
                          // imgUrlSize="?x-oss-process=image/resize,m_pad,h_250,w_400,color_FFFFFF"
                          uploadTip={() => {
                            return <p>支持扩展名：.png .jpg .gif<br/>建议尺寸: 400x250像素</p>
                          }}
                        />
                      </Col>
                    </Row>
                  </CustomCard> */}
                  <CustomCard title='外观'>
                    <Row>
                      <Col>
                        <Uploader
                          uploadSuccessCbf={imgUrl => updateImg(imgUrl, 'exteriorImgs', index)}
                          removeFileCbf={i => updateImg(null, 'exteriorImgs', index, i)}
                          showType='3'
                          maxFiles={20}
                          fileMaxSize={2}
                          fileType='image'
                          uploadedUrls={get(modelObj, `imgs[${index}].exteriorImgs`)}
                          // imgUrlSize="?x-oss-process=image/resize,m_pad,h_250,w_400,color_FFFFFF"
                          uploadTip={() => {
                            return <p>支持扩展名：.png .jpg .gif<br />建议尺寸: 400x250像素</p>
                          }}
                        />
                      </Col>
                      <p className={styles.introduce} >图片建议尺寸：1500x760px</p>
                      <p className={styles.introduce} >建议大小：200kb</p>
                      <p className={styles.introduce} >图片格式：jpg,png</p>
                    </Row>
                  </CustomCard>
                  <CustomCard title='中控'>
                    <Row>
                      <Col>
                        <Uploader
                          uploadSuccessCbf={imgUrl => updateImg(imgUrl, 'centerControlImgs', index)}
                          removeFileCbf={i => updateImg(null, 'centerControlImgs', index, i)}
                          showType='3'
                          maxFiles={20}
                          fileMaxSize={2}
                          fileType='image'
                          uploadedUrls={get(modelObj, `imgs[${index}].centerControlImgs`)}
                          // imgUrlSize="?x-oss-process=image/resize,m_pad,h_250,w_400,color_FFFFFF"
                          uploadTip={() => {
                            return <p>支持扩展名：.png .jpg .gif<br />建议尺寸: 400x250像素</p>
                          }}
                        />
                      </Col>
                      <p className={styles.introduce} >图片建议尺寸：1500x760px</p>
                      <p className={styles.introduce} >建议大小：200kb</p>
                      <p className={styles.introduce} >图片格式：jpg,png</p>
                    </Row>
                  </CustomCard>
                  <CustomCard title='座椅'>
                    <Row>
                      <Col>
                        <Uploader
                          uploadSuccessCbf={imgUrl => updateImg(imgUrl, 'seatImgs', index)}
                          removeFileCbf={i => updateImg(null, 'seatImgs', index, i)}
                          showType='3'
                          maxFiles={20}
                          fileMaxSize={2}
                          fileType='image'
                          uploadedUrls={get(modelObj, `imgs[${index}].seatImgs`)}
                          // imgUrlSize="?x-oss-process=image/resize,m_pad,h_250,w_400,color_FFFFFF"
                          uploadTip={() => {
                            return <p>支持扩展名：.png .jpg .gif<br />建议尺寸: 400x250像素</p>
                          }}
                        />
                      </Col>
                      <p className={styles.introduce} >图片建议尺寸：1500x760px</p>
                      <p className={styles.introduce} >建议大小：200kb</p>
                      <p className={styles.introduce} >图片格式：jpg,png</p>
                    </Row>
                  </CustomCard>
                  <CustomCard title='细节'>
                    <Row>
                      <Col>
                        <Uploader
                          uploadSuccessCbf={imgUrl => updateImg(imgUrl, 'detailImgs', index)}
                          removeFileCbf={i => updateImg(null, 'detailImgs', index, i)}
                          showType='3'
                          maxFiles={20}
                          fileMaxSize={2}
                          fileType='image'
                          uploadedUrls={get(modelObj, `imgs[${index}].detailImgs`)}
                          // imgUrlSize="?x-oss-process=image/resize,m_pad,h_250,w_400,color_FFFFFF"
                          uploadTip={() => {
                            return <p>支持扩展名：.png .jpg .gif<br />建议尺寸: 400x250像素</p>
                          }}
                        />
                      </Col>
                      <p className={styles.introduce} >图片建议尺寸：1500x760px</p>
                      <p className={styles.introduce} >建议大小：200kb</p>
                      <p className={styles.introduce} >图片格式：jpg,png</p>
                    </Row>
                  </CustomCard>
                  <CustomCard title='视频'>
                    {
                      get(modelObj, `imgs[${index}].videoUrls`).map((video, i) => {
                        let length = get(modelObj, `imgs[${index}].videoUrls`).length
                        let addFlag = i === length - 1
                        let deleteFlag = length !== 1
                        return <Row key={'videoRow_' + i} className={styles.videoRow}>
                          <Col span={18}>
                            <FormItem label={'链接'} {...videoFormItemLayout}>
                              <Input
                                maxLength='200'
                                value={get(modelObj, `imgs[${index}].videoUrls[${i}]`)}
                                onChange={e => updateImg(e.target.value, 'videoUrls', index, i)}
                              />
                            </FormItem>
                          </Col>
                          <Col span={4} className={styles.actionBar}>
                            {
                              deleteFlag && <Popconfirm
                                title='确定要删除吗?'
                                okText='确定'
                                cancelText='取消'
                                onConfirm={() => updateImg(null, 'videoUrls', index, i)}
                              >
                                <a>删除</a>
                              </Popconfirm>
                            }
                            {
                              addFlag && <a
                                onClick={() => {
                                  if (length === 20) {
                                    message.warn('最多添加20条视频链接!')
                                    return false;
                                  }
                                  updateImg('', 'videoUrls', index)
                                }}
                              >添加</a>
                            }
                          </Col>
                        </Row>
                      })
                    }
                  </CustomCard>
                </TabPane>
              })
            }
          </Tabs>
        </TabPane>
      </Tabs>

      <Row className={cx('txtcenter', 'mg1b', 'mg2t')}>
        <Button onClick={closeTab} className="mg2r">返回</Button>
        <Button type="primary" className="mg2r" onClick={prevStep}>上一步</Button>
        <Button loading={get(modelObj, 'saveLoading')} type="primary" className="mg2r" onClick={() => saveCar(0)} >保存</Button>
        <Button loading={get(modelObj, 'saveLoading')} type="primary" onClick={() => saveCar(1)}>保存并发布</Button>
      </Row>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
