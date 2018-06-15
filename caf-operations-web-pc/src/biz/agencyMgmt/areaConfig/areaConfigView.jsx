/**
 * @(#)areaConfigView.jsx 0.1.0 2018-03-26
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// React基础组件
import React from 'react'
// dva 连接组件 - 连接route和model
import { connect } from 'dva'
// 表单Form等Antd组件
import { Form, Input, Select, Row, Col, Checkbox, Button, DatePicker, Modal, Icon, Popconfirm, message, Tree, Radio, Table, Cascader } from 'antd';
// 表单域
const FormItem = Form.Item;
const Confirm = Modal.confirm
const Search = Input.Search;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;
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
import styles from './areaConfigStyle.less';
import { browserHistory, hashHistory } from 'dva/router'
/**
* 经销商管理 - 区域设置 组件
*
* @author 贾诩
* @since 0.1.0
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

  {/*==================================树处理函数开始===============================================*/ }
  const dataList = [];
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.key;
      dataList.push({ key, name: node.name, children:node.children,id:node.id });
      if (node.children) {
        generateList(node.children, node.key);
      }
    }
  };
  generateList(modelObj.areaTree);

  const getSearch = (value) => {
    const expandedKeys = dataList.map((item) => {
      if (item.name.indexOf(value) > -1) {
        return getParentKey(item.name, modelObj.areaTree);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    dispatch({
      type: `${namespace}/getSearchKey`,
      payload: {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      }
    });
  }

  const getParentKey = (name, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.name === name)) {
          parentKey = node.id + '';
        } else if (getParentKey(name, node.children)) {
          parentKey = getParentKey(name, node.children);
        }
      }
    }
    return parentKey;
  };

  const getTreeTitle = (title, item) => {
    return <div>
      {title}
      {
        item.id + '' === modelObj.selectedKeys + '' &&
        <ButtonGroup style={{ display: 'block' }} size="small" onClick={e => { e.stopPropagation() }}>
          <Button onClick={() => changeModal(true, 'treeVisible')}><i className="iconfont icon-zengjia"></i>增加</Button>
          {
            item.parentId !== 0 &&
            <Popconfirm Collapse title='确定要删除吗？' okText='确定' cancelText='取消' onConfirm={() => deleteNode(item)}>
              <Button><i className="iconfont icon-shanchu"></i>删除</Button>
            </Popconfirm>
          }
        </ButtonGroup>
      }
    </div>
  }

  const loop = data => data.map((item) => {
    const index = item.name.indexOf(modelObj.searchValue);
    const beforeStr = item.name.substr(0, index);
    const afterStr = item.name.substr(index + modelObj.searchValue.length);
    const title = index > -1 ? (
      <span>
        {beforeStr}
        <span style={{ color: '#f50' }}>{modelObj.searchValue}</span>
        {afterStr}
      </span>
    ) : <span>{item.name}</span>;
    if (item.children && item.children.length > 0) {
      return (
        <TreeNode key={item.id} parentId={item.parentId} title={getTreeTitle(title, item)}>
          {loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.id} parentId={item.parentId} title={getTreeTitle(title, item)} />;
  });

  const onExpand = (expandedKeys) => {
    dispatch({
      type: `${namespace}/onExpand`,
      payload: {
        expandedKeys,
        autoExpandParent: false,
      }
    });
  }

  const onSelect = (selectedKeys,e) => {
    dispatch({
      type: `${namespace}/getSelectDetail`,
      payload: {
        selectedKeys: selectedKeys[0],
        parentId:e.node.props.parentId
      }
    });
  }
  {/*==================================树处理函数结束===============================================*/ }

  const addNode = () => {
    dispatch({
      type: `${namespace}/addNode`,
      payload: {
      }
    })
  }

  const saveNode = () => {
    dispatch({
      type: `${namespace}/saveNode`,
      payload: {
      }
    })
  }

  const deleteNode = (item) => {
    if (item.children.length === 0){
      dispatch({
        type: `${namespace}/deleteNode`,
        payload: {
          id:item.id
        }
      })
    }else {
      return message.error('已存在下级分组，请先删除下级分组')
    }
  }

  const changeModal = (visible, type) => {
    dispatch({
      type: `${namespace}/changeModal`,
      payload: {
        visible, type
      }
    })
  }

  const addCity = () => {
    dispatch({
      type: `${namespace}/addCity`,
      payload: {
      }
    })
  }

  const deleteCity = (index) => {
    dispatch({
      type: `${namespace}/deleteCity`,
      payload: {
        index
      }
    })
  }

  return (
    <div className="public_listMain">
      <Modal
        title="添加目录"
        visible={modelObj.treeVisible}
        onOk={() => addNode()}
        onCancel={() => changeModal(false, 'treeVisible')}
        confirmLoading={modelObj.addLoading}
      >
        <Row>
          <Col span={2} style={{ width: 72, marginRight: 8 }}>
            <div className="ant-form-item-label">
              <label className="ant-form-item-required">区域名称</label>
            </div>
          </Col>
          <Col span={20}>
            <Input placeholder="请输入区域名称" maxLength='50' value={modelObj.nodeName} onChange={(e) => updateModel(e.target.value, 'nodeName')} />
          </Col>
        </Row>
      </Modal>
      <div className="boxShadow">
        <div style={{ border: '1px solid #EFEFF1', overflow: 'hidden' }}>
          {/*左右布局，左边树*/}
          <div style={{ width: 359, float: 'left', borderRight: '1px solid #EFEFF1' }}>
            <Search style={{ padding: '16px 0 16px 16px', width: 343 }} placeholder="搜索分类" onSearch={value => getSearch(value)} />
            <div style={{ backgroundColor: '#FBFBFB', paddingLeft: 8, height: 600, overflow: 'auto' }}>
              <Tree
                showLine
                onExpand={onExpand}
                expandedKeys={modelObj.expandedKeys}
                autoExpandParent={modelObj.autoExpandParent}
                onSelect={onSelect}
              >
                {loop(modelObj.areaTree)}
              </Tree>
            </div>
          </div>

          {/*左右布局，右边详情*/}
          <div style={{ padding: '16px 16px 16px 375px' }}>

            {
              !!modelObj.selectedKeys &&
              <div>
                <div>
                  <div className="ant-form-item-label">
                    <label className="ant-form-item-required">区域编号</label>
                  </div>
                  <Input placeholder="请输入区域编号" style={{ width: 300 }} maxLength='50' value={modelObj.orgCode} onChange={e => updateModel(e.target.value, 'orgCode')} />
                </div>

                <div style={{ marginTop: 16 }}>
                  <div className="ant-form-item-label">
                    <label className="ant-form-item-required">区域名称</label>
                  </div>
                  <Input placeholder="请输入区域名称" style={{ width: 300 }} maxLength='50' value={modelObj.orgName} onChange={e => updateModel(e.target.value, 'orgName')} />
                </div>

                <div style={{ margin: '16px 0' }}>
                  <div className={styles.classify}>
                    <h2>区域管辖城市</h2>
                  </div>
                  {
                    modelObj.isLeaf && 
                    <div style={{ textAlign: 'left',margin:'16px 0' }}>
                    <Cascader 
                    options={modelObj.cityTree} 
                    placeholder="请添加城市" 
                    style={{width:500,marginRight:8}}
                    showSearch
                    onChange={(value,selectedOptions) => updateModel(selectedOptions,'city') }
                    />
                    <Button onClick={() => addCity()}>添加城市</Button>
                    </div>
                  }
                  <div className={styles.choicedName}>
                    {
                      modelObj.cityList.map((item, index) => {
                        return <span key={index}>{item.cityName}{modelObj.isLeaf && <Icon type="close" onClick={() => deleteCity(index)}/>}</span>
                      })
                    }
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <Button type="primary" style={{ marginRight: 16 }} onClick={() => saveNode()} loading={modelObj.saveLoading}>保存</Button>
                  <Button>取消</Button>
                </div>
              </div>
            }

          </div>
        </div>
      </div>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
