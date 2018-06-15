import React, { Component } from 'react';
import cx from 'classnames'
import { Row, Col, Form, Icon, Popconfirm, Table, Input, Select } from 'antd';
import { Link } from "dva/router";
const Option = Select.Option
const FormItem = Form.Item

import styles from "./index.less";
import config from "Config/config";
import { cloneDeep, get, isArray } from "lodash";

/**
 * 属性组 组件
 * @author 阿九
 * @since 0.1.0
 *
 * @prop {[object]} propList  根据该属性生成tab
 * @prop {[object]} propData 生成的tab中如果有data中已有的数据 要填进去
 *
 * @prop {[function]} dataCbk (groupId, groupObj) 将数据传回给父组件
 */

const colLayout = {
  xs: { span: 24 },
  sm: { span: 22 },
  md: { span: 20 },
  lg: { span: 18 },
  xl: { span: 16 },
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

class PropTab extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
      initFlag: true, // 执行过mergePropData后置为false 才能根据数据生成表单
      propData: {},
      propList: {
        props: [],
      },
      listDom: null,
    }
  }

  // 单元格状态变化
  onCellChange(value, name, propId) {
    let { propData } = this.state
    let copyData = cloneDeep(propData)
    if (isArray(name)) {
      name.map((e, i) => {
        copyData.propArray[propId][e] = value[i]
      })
    } else {
      copyData.propArray[propId][name] = value
    }
    this.props.dataCbk(copyData.groupId, copyData)
  }

  // 根据propList和propData 整合生成新的propData 并传出去 只执行一次
  mergePropData() {
    let { propList, propData } = this.props
    // 1. propData 没有
    // 2. propData 有, 里面的数据不全
    let newPropData = {}
    if (!!propData) {
      // propData存在
      newPropData = {
        groupId: propData.groupId,
        groupName: propData.groupName,
        propArray: {}
      }
      propList.props.map(prop => {
        let exsitData = propData.propArray[prop.propId]
        if (!exsitData) {
          //数据没有
          newPropData.propArray[prop.propId] = {
            propId: prop.propId,
            propName: prop.propName,
            type: prop.type,
            valueId: null,
            valueName: null,
            values: null
          }
        } else {
          newPropData.propArray[prop.propId] = exsitData
        }
      })
    } else {
      // propData不存在
      let propArray = {}
      propList.props.map(prop => {
        propArray[prop.propId] = {
          propId: prop.propId,
          propName: prop.propName,
          type: prop.type,
          valueId: null,
          valueName: null,
          values: null
        }
      })
      newPropData = {
        groupId: propList.groupId,
        groupName: propList.groupName,
        propArray
      }
    }
    this.props.dataCbk(propList.groupId, newPropData)
    // this.setState({initFlag: false, propGroup: newPropData}, () => {
    //   this.generateList()
    // })
  }

  // 根据propList生成表单
  // generateList() {
  //   let { propList, propData } = this.state
  //   let listDom = propList.props.map(prop => {
  //     let propDom = null
  //     if (prop.type == 4 || prop.type == 6) {
  //       // 属性是下拉框或颜色
  //       propDom = <Row key={'row_' + prop.propId + Math.random()}>
  //         <Col {...colLayout}>
  //           <FormItem label={prop.propName} {...formItemLayout}>
  //             <Select
  //               value={get(propData, `propArray[${prop.propId}].valueId`, '')}
  //               onSelect={(e, n) => this.onCellChange([e, n.props.children], ['valueId', 'values'], prop.propId)}
  //             >
  //               <Option value=''>请选择</Option>
  //               {
  //                 prop.values.map(e => <Option
  //                   key={'op_' + e.id}
  //                   value={e.id + ''}>{e.name}</Option>
  //                 )
  //               }
  //             </Select>
  //           </FormItem>
  //         </Col>
  //       </Row>
  //     } else {
  //       // 属性是输入框
  //       propDom = <Row key={'row_' + prop.propId + Math.random()}>
  //         <Col {...colLayout}>
  //           <FormItem label={prop.propName} {...formItemLayout}>
  //             <Input
  //               value={get(propData, `propArray[${prop.propId}].values`) || ''}
  //               onChange={e => this.onCellChange(e.target.value, 'values', prop.propId)}
  //             />
  //           </FormItem>
  //         </Col>
  //       </Row>
  //     }
  //     return propDom
  //   })
  //   console.log('listDom', listDom)
  //   this.setState({initFlag: false, listDom})
  // }

  render() {
    let { propList, propData } = this.state
    const { getFieldDecorator } = this.props.form

    return <div>
      {
        propList.props.map((prop, i) => {
          if (prop.type == 4) {
            // 属性是下拉框
            return <Row key={'row_' + i}>
              <Col {...colLayout}>
                <FormItem label={prop.propName} {...formItemLayout}>
                  <Select
                    value={get(propData, `propArray[${prop.propId}].valueId`, '')}
                    onSelect={(e, n) => this.onCellChange([e, n.props.children], ['valueId', 'values'], prop.propId)}
                  >
                    <Option value=''>请选择</Option>
                    {
                      prop.values.map(e => <Option
                        key={'op_' + e.id}
                        value={e.id + ''}>{e.name}</Option>
                      )
                    }
                  </Select>
                </FormItem>
              </Col>
            </Row>
          } else if (prop.type == 6) {
            // 属性是下拉框或颜色
            return <Row key={'row_' + i}>
              <Col {...colLayout}>
                <FormItem label={prop.propName} {...formItemLayout}>
                  <Select
                    value={get(propData, `propArray[${prop.propId}].valueId`, '')}
                    onSelect={(e, n) => {
                      this.onCellChange(
                        [e, n.props.children, n.props.data_imgUrl],
                        ['valueId', 'values', 'imgUrl'],
                        prop.propId
                      )
                    }}
                  >
                    <Option value=''>请选择</Option>
                    {
                      prop.values.map(e => <Option
                        key={'op_' + e.id}
                        data_imgUrl={e.imgUrl}
                        value={e.id + ''}>{e.name}</Option>
                      )
                    }
                  </Select>
                  {
                    !!get(propData, `propArray[${prop.propId}].imgUrl`, '') && <div className={styles.imgContainer}>
                      <img
                        width='140'
                        height='26'
                        src={get(propData, `propArray[${prop.propId}].imgUrl`) + '?x-oss-process=image/resize,m_fill,h_30,w_140'}
                      />
                    </div>
                  }
                </FormItem>
              </Col>
            </Row>
          } else {
            // 属性是输入框
            return <Row key={'row_' + i}>
              <Col {...colLayout}>
                <FormItem label={prop.propName} {...formItemLayout}>
                  <Input
                    value={get(propData, `propArray[${prop.propId}].values`) || ''}
                    onChange={e => this.onCellChange(e.target.value, 'values', prop.propId)}
                  />
                </FormItem>
              </Col>
            </Row>
          }
        })
      }
    </div>
  }

  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) {
  }

  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) {
  }

  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps) {
    // if (this.state.initFlag) {
    //   this.setState({propList: nextProps.propList, propData: nextProps.propData})
      // this.generateList(nextProps.propList, nextProps.propData)
    // } else {
    //   console.log('222', nextProps.propData)
    // }
    this.setState({propList: nextProps.propList, propData: nextProps.propData})
  }

  // 插入真实 DOM
  componentDidMount() {
    this.mergePropData()
  }

}

export default PropTab
