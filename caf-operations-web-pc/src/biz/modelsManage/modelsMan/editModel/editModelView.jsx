// React基础组件
import React from 'react'
import cx from 'classnames'
// dva 连接组件 - 连接route和model
import { connect } from 'dva'
import { CustomCard } from '../../../../components/Grid/index'
// 引入antd的组件
import { Form, Input, Row, Col, Checkbox, Select, Button } from 'antd'
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option

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
//
import BasicInfo from "./basicInfo";
import DetailInfo from "./detailInfo";


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


 /**
 * 车型管理 - 新增/编辑车型 组件
 *
 * @author 阿九
 * @since 0.1.0
 */
const routeView = function({dispatch, model, form}) {
  // 表单的子函数
  const {resetFields, getFieldDecorator, validateFields, setFieldsValue} = form
  // 取出model对象，命名空间
  const { modelObj, namespace } = model

  // 校验函数
  // 特殊字符校验
  function validatorSpecialStr(name, rule, value, callback) {
    if (Verify.hasSpecialCharacter(value)) {
      callback(name + '输入格式不正确')
    } else{
      callback()
    }
  }
  // 只允许数字
  function validatorNumberOnly(name, rule, value, callback) {
    if (Verify.numberOnly(value)) {
      callback(name + '输入格式不正确')
    } else{
      callback()
    }
  }
  // 只允许字母和数字
  function validatorAlphaAndNumOnly(name, rule, value, callback) {
    if (Verify.alphabetAndNumber(value)) {
      callback(name + '输入格式不正确')
    } else{
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

  // 子组件步骤完成时调用, 切换子组件
  const changeView = (view, step) => {
    updateModel(view, 'currentViewName')
  }

  // view切换函数
  const currentView = (name) => {
    const viewMapper = {
      "basicInfo": <BasicInfo changeCbk={changeView}/>, // 基本信息
      "detailInfo": <DetailInfo changeCbk={changeView}/>, // 详情
    }
    // updateModel(viewMapper[name].step, 'step')
    return viewMapper[name]
  }

  return (
    <div className="public_listMain">
      {
        currentView(get(modelObj, 'currentViewName'))
        // currentView('fullMinus')
      }
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
