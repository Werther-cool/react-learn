import React from 'react';
import { Icon, Popconfirm, Table } from 'antd';
const { Component } = React
import styles from "./index.less";
import config from "Config/config";
import cx from 'classnames'
import { cloneDeep } from "lodash";
import {numberFormat} from 'Utils/dataFormat';

// 状态映射
const statusMappper = ['待上架', '上架', '未报价']

class ChildrenTable extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
      columns: [
        {
          title: '车型规格',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '指导价',
          key: 'guidePrice',
          width: 100,
          dataIndex: 'guidePrice',
          render: (text, record, index) => {
            return <div>{numberFormat(text)}</div>
          }
        },
        {
          title: '报价',
          key: 'offerPrice',
          width: 100,
          dataIndex: 'offerPrice',
          render: (text, record, index) => {
            return <div style={{color: record.offerPricelimit ? 'red' : '#666'}}>
              {numberFormat(text)}
            </div>
          }
        },
        // {
        //   title: '底价',
        //   key: 'lowPrice',
        //   width: 100,
        //   dataIndex: 'lowPrice',
        //   render: (text, record, index) => {
        //     return <div>{numberFormat(text)}</div>
        //   }
        // },
        {
          title: '状态',
          key: 'status',
          width: 100,
          dataIndex: 'status',
          render: (text, record, index) => {
            return <div>{ statusMappper[text] }</div>
          }
        },
        {
          title: '操作',
          key: 'actions',
          width: 100,
          dataIndex: 'actions',
          render: (text, record, index) => {
            let action = <div />
            if (record.status == 1) {
              action = <a onClick={() => this.props.actionCbk(record.id)}>强制下架</a>
            }
            return action
          }
        },

      ],
    }
  }

  render() {
    let self = this
    return (
      <div
        className={styles.childrenTable}
        ref='cellDom'
      >
        <Table
          columns={this.state.columns}
          dataSource={this.props.dataSource}
          showHeader={false}
          pagination={false}
          bordered={false}
        />
      </div>
    )
  }

  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) {
  }

  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) {
  }

  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps) {
  }

  // 插入真实 DOM
  componentDidMount() {
  }

}

export default ChildrenTable
