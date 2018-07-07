/**
 * @(#)userDetailsView.jsx 0.1.0 2018-03-22
 * Copyright (c) 2018, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import React from 'react';
// dva 连接组件 - 连接route和model
import {connect} from 'dva';
// 选项卡、表格、弹出确认框
import {
  Tabs, Form, Table,
  Pagination, message, Input,
  Select, Row, Col,
  Button, InputNumber,TreeSelect,
  Popconfirm, Icon, Modal
} from 'antd';
// 获取样式类名
import cx from 'classnames'
// 当前页面样式
import styles  from './userDetailsStyle.less'
import config from '../../../../config/config'
import {isEmpty, cloneDeep, get} from 'lodash'
import TableMove from "../../../../components/tableMove/index";
// 表单域
const FormItem = Form.Item;
// 判断对象是否为空
import { Link,hashHistory } from 'dva/router'
const Option = Select.Option;
import CollapsiblePanels from '../../../common/collapsiblePanels/index';
import comCss from '../../../common/comCss/comCss.less'
import ComHtml from '../../../common/comCss/index'
import Img from '../../../common/imgBoost/indexImg';
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
 * 系统管理 - 用户详情 组件
 *
 * @author 扬帆
 * @since 0.1.0
 */

const userDetailsView = function({dispatch, userDetailsMod, form}) {
  //状态值
  let {
    userName,
    password,
    realName,
    phone,
    imgUrl,
    roleIds,
    number,
    department,
    post,
    telephone,
    rolePra,
    selRole,
    submitLoading,
  } = userDetailsMod;

  return (
    <div className="public_listMain">
      <div className="functionButton">
        <Button
          type="primary"
          onClick={()=>{
            hashHistory.push('/home/systemMgmt/userList');
          }}
        >
          <i className="iconfont icon-fanhui"></i>返回
        </Button>
      </div>

      <CollapsiblePanels
        title={'用户信息'}
        stop={1}
      >
        <div className={styles.userTop}>
          <div className={styles.userTop_left}>
            <div className={styles.userHeadImg}>
              {
                imgUrl && <Img
                  src={imgUrl.split('?')[0]}
                  alt=""
                  width={'100%'}
                  height={'100%'}
                  classN={'classN'}
                />
              }
              {
                '' === imgUrl?<div className={styles.userHeadImg_b}>
                  <i className="iconfont icon-yonghuming"></i>
                  <p>暂无头像</p>
                </div> : ''
              }
            </div>
          </div>

          <div className={styles.userTop_right}>
            {/*<div className={comCss.comLi + ' ' + comCss.comLi_top}>
              <div className={comCss.comLi_left}>
                <div className={comCss.comLi_name}>用户账号：</div>
                <div className={comCss.comLi_content}>{userName}</div>
              </div>
              <div className={comCss.comLi_right}>
                <div className={comCss.comLi_name}>姓名：</div>
                <div className={comCss.comLi_content}>
                  {realName}
                </div>
              </div>
            </div>

            <div className={comCss.comLi}>
              <div className={comCss.comLi_left}>
                <div className={comCss.comLi_name}>工号：</div>
                <div className={comCss.comLi_content}>{number}</div>
              </div>
              <div className={comCss.comLi_right}>
                <div className={comCss.comLi_name}>工作电话：</div>
                <div className={comCss.comLi_content}>
                  {telephone}
                </div>
              </div>
            </div>

            <div className={comCss.comLi}>
              <div className={comCss.comLi_name}>手机号：</div>
              <div className={comCss.comLi_content}>{phone}</div>
            </div>*/}

            <ComHtml
              data={{
                arrName: ['用户账号', '姓名', '工号', '工作电话', '手机号'],
                arrValue: [userName, realName, number, telephone, phone],
              }}
            />
          </div>
        </div>
      </CollapsiblePanels>

      <CollapsiblePanels
        title={'关联角色'}
        stop={1}
      >
        <div className={styles.userFooter_rol}>
          {/*<span>摸摸摸<Icon type="close"/></span>*/}
          {
            selRole && selRole.map((obj, i)=>{
              return <span key={'role_' + i}>
                {obj.name}
              </span>
            })
          }
          {
            selRole && selRole.length <= 0?<div style={{color:'#ccc', textAlign:'center'}}>
              暂无数据...
            </div>:''
          }
        </div>
      </CollapsiblePanels>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(({ userDetailsMod }) => ({ userDetailsMod }))(Form.create()(userDetailsView))
