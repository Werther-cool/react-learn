import React from 'react';
import {Icon} from 'antd';
const { Component } = React
import cx from 'classnames'
import styles from './collapsiblePanels.less'
import $ from 'jquery'
export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
      collapse:true,
      stop:this.props.stop || 0 //是否显示展开和收起字样,,如果为1，则不显示
    }
  }

  changeStatus() {
    this.setState({collapse:!this.state.collapse})
  };


  render() {
    return (
      <div style={{marginTop:16,position:'relative'}}>
        <dl className={cx(styles.dlMain, 'dropdownShadow')}>
          <dt className={`${!this.state.collapse ? 'slideHide' : ''}`}>{this.props.title}{this.state.stop != 1 ? <span onClick={() => this.changeStatus()} >{this.state.collapse?'收起':'展开'} <Icon type="up" /></span> : ''}</dt>
          <dd className={`${!this.state.collapse ? 'slideHide' : ''}`}>
            <div style={{padding: '16px'}}>
              {this.props.children}
            </div>
          </dd>
        </dl>
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
