/**
 * @(#)smsTempletListView.jsx 0.2.0 2018-05-14
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// React基础组件
import React from 'react'
// dva 连接组件 - 连接route和model
import { connect } from 'dva'
// 表单Form等Antd组件
import { Form, Input, Select, Row, Col, Checkbox, Button, DatePicker, Modal, Icon, Popconfirm } from 'antd';
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
import comCss from '../../common/comCss/comCss.less';
import $ from "jquery";
import styles from './templetDetailStyle.less';
import { browserHistory, hashHistory } from 'dva/router'
import BasicTable from 'Components/BasicTable'
/**
* 消息管理 - 模板详情 组件
*
* @author 贾诩
* @since 0.2.0
*/
const routeView = function ({ dispatch, model, form }) {
  const { resetFields, getFieldDecorator, validateFields, setFieldsValue } = form;
  // 取出model对象，命名空间
  const { modelObj, namespace } = model
  const { modalStatus } = modelObj;

  //状态值变化
  function updateModel(value, name, modHierarchy) {
    let obj = modelObj;
    if (modHierarchy) {
      modHierarchy = modHierarchy.split(".");
      modHierarchy.map(e => {
        obj = obj[e];
      });
    }
    //如果是时间
    if (name == 'time') {
      obj['startTime'] = value[0];//发布开始时间
      obj['endTime'] = value[1];//发布结束时间
    } else {
      obj[name] = value;
    }
    // 分发到model
    dispatch({
      type: `${namespace}/updateModel`,
      payload: obj
    });
  };

  let templetInfo = {
    ui: {
      table_data: {},
      columns: 1,
      fields: [
        {
          en_name: 'updateName',
          zh_name: '短信模板编号',
        },
        {
          en_name: 'updatePhone',
          zh_name: '消息接收方',
        },
        {
          en_name: 'name',
          zh_name: '业务类型',
        },
        {
          en_name: 'createTime',
          zh_name: '触发事件/节点',
        },
        {
          en_name: 'checkUser',
          zh_name: '消息标题',
        },
        {
          en_name: 'checkTime',
          zh_name: '模板内容',
        }
      ]
    }
  };

  return (
    <div className="public_listMain">
      <div className="boxShadow">
        <BasicTable tableProps={templetInfo} />
      </div>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
