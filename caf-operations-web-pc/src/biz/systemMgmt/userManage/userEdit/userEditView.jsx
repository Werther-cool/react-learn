/**
 * @(#)userEditView.jsx 0.1.0 2018-03-13
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
import styles  from './userEditStyle.less'
import config from '../../../../config/config'
import {isEmpty, cloneDeep, get} from 'lodash'
import TableMove from "../../../../components/tableMove/index";
// 表单域
const FormItem = Form.Item;
// 判断对象是否为空
import { Link,hashHistory } from 'dva/router'
const Option = Select.Option;
import FormHtml from '../../../common/formHtml/index';
import CollapsiblePanels from '../../../common/collapsiblePanels/index';
import {isPhoneNum, passwordNum} from '../../../common/verify/index';
// 引入上传组件
import Uploader from '../../../../components/Upload'
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
 * 系统管理 - 新增、编辑用户 组件
 *
 * @author 扬帆
 * @since 0.1.0
 */

const userEditView = function({dispatch, userEditMod, form}) {
  // console.log('数据: ', userEditMod);

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
    editId,
  } = userEditMod;

  // 表单的子函数
  const {
    resetFields,
    getFieldDecorator,
    validateFields,
    setFieldsValue,
    validateFieldsAndScroll,
  } = form;

  //改变状态
  const changeState = (value, name)=>{
    //赋值修改状态
    let obj = {};
    obj[name] = value;

    dispatch({
      type: 'userEditMod/updateModel',
      payload: obj
    })
  };

  //修改其他参数
  const changeOther = (value, name, pName)=>{
    dispatch({
      type: 'userEditMod/changeOther',
      payload: {value, name, pName}
    })
  };

  //提交表单
  const onSubmit = (e)=>{
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        //保存数据前操作
        changeState(true, 'submitLoading');

        dispatch({
          type: 'userEditMod/onSubmit',
          payload: {}
        })
      }
    });
  };

  const test = [
    {
      name: 'xxxx',
      id: '123456',
    },
    {
      name: 'qqqq',
      id: '111',
    },
    {
      name: 'cccc',
      id: '222',
    },
  ];

  //分页
  const newPagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: parseInt(rolePra.pageNum),//当前页
    pageSize: rolePra.pageSize,//单页条数
    total: rolePra.total,//总条数
    showTotal: e=>`共${rolePra.total}条`,
    onChange: changePage, //分页事件
    onShowSizeChange: changePage, //每页条数
  };
  //设置翻页
  function changePage(page, pageSize) {
    dispatch({
      type: 'userEditMod/queryRole',
      payload: {pageNum: page, pageSize: pageSize, nameOrCode: rolePra.nameOrCode}
    });
  }

  // 列表页面的复选框
  const rowSelection = {
    selectedRowKeys: rolePra.selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      changeOther(selectedRowKeys, 'selectedRowKeys', 'rolePra');
    },
  };

  //用户账号校验
  const userVal = (rule, value, callback)=>{
    if(value && !isPhoneNum(value)){
      callback('用户账号为11位数的手机号');
    }
    callback();
  };

  //登录密码校验
  const passwordVal = (rule, value, callback)=>{
    if(value && !passwordNum(value) && '' === editId){
      callback('登录密码为6~20位数字、字母的组合');
    }
    callback();
  };

  //删除选中的角色
  const deleteRole = (id)=>{
    dispatch({
      type: 'userEditMod/deleteRole',
      payload: {id}
    })
  };

  return (
    <div className="public_listMain">
      <Form onSubmit={onSubmit}>
        <div className="functionButton">
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            <i className="iconfont icon-baocun"></i>保存
          </Button>
        </div>

        <CollapsiblePanels
          title={'用户信息'}
          stop={1}
        >
          <div className={styles.userTop}>
            <div className={styles.userTop_left}>
              <Uploader
                uploadSuccessCbf={imgUrl => {
                  changeState(imgUrl, 'imgUrl')
                }}
                removeFileCbf={() => changeState('', 'imgUrl')}
                showType='3'
                fileType='image'
                fileMaxSize={2}
                uploadedUrls={'' === imgUrl?[]:[imgUrl.split('?')[0]]}
                imgUrlSize="?x-oss-process=image/resize,m_pad,h_250,w_400,color_FFFFFF"
                uploadTip={() => {
                  // return <p>支持扩展名：.png .jpg .gif<br/>建议尺寸: 400x250像素</p>
                }}
                iconType={'icon-yonghuming'}
                uploadText={'上传头像'}
                classN={'classN'}
              />

              {/*<div className={styles.userHeadImg}>
                <div className={styles.userHeadImg_b}>
                  <i className="iconfont icon-yonghuming"></i>
                  <p>上传头像</p>
                </div>
              </div>*/}
            </div>
            <div className={styles.userTop_right}>
              <Input id="userName" type='text' style={{display: 'none'}}/>

              <Row>
                <Col span={12}>
                  <FormHtml
                    id={'userName'}
                    form={form}
                    type={'Input'}
                    label={'用户账号'}
                    required={true}
                    ifValidator={true}
                    value={userName}
                    placeholder={'请输入用户账号'}
                    inputPar={{
                      maxLength: '11',
                    }}
                    onChange={changeState}
                    validator={userVal}
                  />
                </Col>
                <Col span={12}>
                  <FormHtml
                    id={'password'}
                    form={form}
                    type={'Input'}
                    label={'登录密码'}
                    required={true}
                    ifValidator={true}
                    value={password}
                    disabled={'' !== editId?true:false}
                    placeholder={'请输入登录密码'}
                    inputPar={{
                      type: 'password',
                    }}
                    onChange={changeState}
                    validator={passwordVal}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormHtml
                    id={'realName'}
                    form={form}
                    type={'Input'}
                    label={'姓名'}
                    required={true}
                    value={realName}
                    placeholder={'请输入姓名'}
                    inputPar={{
                      maxLength: '10',
                    }}
                    onChange={changeState}
                  />
                </Col>
                <Col span={12}>
                  <FormHtml
                    id={'number'}
                    form={form}
                    type={'Input'}
                    label={'工号'}
                    value={number + ''}
                    placeholder={'请输入工号'}
                    inputPar={{
                      maxLength: '10',
                    }}
                    onChange={changeState}
                  />
                </Col>
              </Row>
              {/*功能未开发，暂时隐藏*/}
              {/*<Row>
                <Col span={12}>
                  <FormHtml
                    id={'department'}
                    form={form}
                    type={'Select'}
                    label={'部门'}
                    value={department}
                    placeholder={'请选择部门'}
                    onChange={changeState}
                    selectPar={{
                      data: test,
                      defaultSelName: '部门',
                      valueName: 'id'
                    }}
                  />
                </Col>
                <Col span={12}>
                  <FormHtml
                    id={'post'}
                    form={form}
                    type={'Select'}
                    label={'岗位'}
                    value={post}
                    placeholder={'请选择岗位'}
                    onChange={changeState}
                    selectPar={{
                      data: test,
                      defaultSelName: '岗位',
                      valueName: 'id'
                    }}
                  />
                </Col>
              </Row>*/}
              <Row>
                <Col span={12}>
                  <FormHtml
                    id={'telephone'}
                    form={form}
                    type={'Input'}
                    label={'工作电话'}
                    value={telephone}
                    placeholder={'请输入工作电话'}
                    inputPar={{
                      maxLength: '15',
                    }}
                    onChange={changeState}
                  />
                </Col>
                <Col span={12}>
                  <FormHtml
                    id={'phone'}
                    form={form}
                    type={'Input'}
                    label={'手机号'}
                    value={phone}
                    placeholder={'请输入手机号'}
                    inputPar={{
                      maxLength: '11',
                    }}
                    onChange={changeState}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </CollapsiblePanels>

        <CollapsiblePanels
          title={'关联角色'}
          stop={1}
        >
          <Button
            icon='plus'
            // type="primary"
            className={styles.userFooter_btn}
            onClick={()=>{
              dispatch({
                type: 'userEditMod/onRole',
                payload: {}
              });
            }}
          >
            角色
          </Button>

          <div className={styles.userFooter_rol}>
            {/*<span>摸摸摸<Icon type="close"/></span>*/}
            {
              selRole && selRole.map((obj, i)=>{
                return <span key={'role_' + i}>
                  {obj.name}
                  <Icon
                    type="close"
                    onClick={()=>{
                      deleteRole(obj.id);
                    }}
                  />
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
      </Form>

      {/*角色弹窗*/}
      <Modal
        title="添加角色"
        width={666}
        visible={rolePra.visible}
        onOk={()=>{
          dispatch({
            type: 'userEditMod/onOkRole',
            payload: {}
          });
        }}
        onCancel={()=>{
          // changeOther(false, 'visible', 'rolePra')
          dispatch({
            type: 'userEditMod/onCancelRole',
            payload: {}
          });
        }}
      >
        <Row gutter={16} style={{marginBottom: '20px'}}>
          <Col span={12}>
            <Input
              value={rolePra.nameOrCode}
              onChange={(e)=>{
                changeOther(e.target.value, 'nameOrCode', 'rolePra')
              }}
              placeholder='输入编号或名称查询'
              maxLength={'30'}
            />
          </Col>
          <Col span={8}>
            <Button
              onClick={()=>{
                dispatch({
                  type: 'userEditMod/onRole',
                  payload: {}
                });
              }}
            >搜索</Button>
          </Col>
        </Row>

        <div className={styles.roleTable}>
          <Table
            columns={rolePra.columns}
            dataSource={rolePra.list}
            pagination={newPagination}
            loading={rolePra.loading}
            rowSelection={rowSelection}
          />
        </div>

      </Modal>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(({ userEditMod }) => ({ userEditMod }))(Form.create()(userEditView))
