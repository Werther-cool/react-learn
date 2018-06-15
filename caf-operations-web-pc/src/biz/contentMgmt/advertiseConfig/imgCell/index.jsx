import React from 'react';
import { Row, Col , Radio, Input, Select, Icon, Popconfirm } from 'antd';
const { Component } = React
import styles from "./index.less";
import config from "Config/config";
import cx from 'classnames'
import { cloneDeep } from "lodash";
// 引入上传组件
import Uploader from 'Components/Upload'
const RadioGroup = Radio.Group
const Option = Select.Option

class ImgCell extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.props.imgProps,
      height: '',
      width: '',
      check: false, // 是否被勾选
      carList:[],
    }
  }

  check() {
    // 1. 把id传给父组件 2. 改变样式
    let { check } = cloneDeep(this.state)
    this.setState({check: !check})
  }


  render() {
    let self = this
    return (
      <div className={styles.imgCell} ref='cellDom'>
        <Row className={styles.advertiseCell}>
          <Col span={4} offset={2}>
            <Uploader
              uploadSuccessCbf={imgUrl => this.props.actionCbk(this.state.advertiseId, 'edit', 'url', imgUrl) }
              removeFileCbf={() => this.props.actionCbk(this.state.advertiseId, 'edit', 'url', '')}
              showType='2'
              fileMaxSize={2}
              fileType='image'
              uploadedUrls={this.state.url}
              // imgUrlSize="? ,m_pad,h_100,w_100,color_FFFFFF"
              uploadTip={() => {
                return <p>支持扩展名：.png .jpg .gif<br/>建议尺寸: 400x250像素</p>
              }}
            />
          </Col>
          <Col span={7}>
            <RadioGroup
              value={this.state.redirect}
              onChange={e => this.props.actionCbk(this.state.advertiseId, 'edit', 'redirect', e.target.value)}
            >
              <Radio className={styles.option} value={1}>不跳转</Radio>
              <Radio className={styles.option} value={2}>
                设置链接
                <Input
                  value={this.state.redirectUrl || ''}
                  className={cx('mg1l')}
                  onChange={e => this.props.actionCbk(this.state.advertiseId, 'edit', 'redirectUrl', e.target.value)}
                />
              </Radio>
              <Radio className={styles.option} value={3}>
                跳转车型
                <Select className={cx('mg1l')} onChange={value => this.props.actionCbk(this.state.advertiseId, 'edit', 'carId', value)} value={this.state.carId || ''}>
                {
                  this.state.carList && this.state.carList.map((obj,idx) => {
                    return  <Option value={obj.id} key={idx}>{obj.carName}</Option>
                  })
                }
                </Select>
              </Radio>
            </RadioGroup>
          </Col>
          {
            !this.props.hideActionBar && <Col className={styles.actionBar} span={6}>
              <Popconfirm
                title='确定要删除吗?'
                okText='确定'
                cancelText='取消'
                onConfirm={() => this.props.actionCbk(this.state.advertiseId, 'delete')}
              >
                <a className='mg1r'>删除</a>
              </Popconfirm>
              {
                this.props.showAdd && <a
                  onClick={() => this.props.actionCbk('', 'add')}
                >添加</a>
              }
            </Col>
          }
        </Row>
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
    this.setState({...nextProps.imgProps,carList:nextProps.carList})
  }

  // 插入真实 DOM
  componentDidMount() {
    let width = this.refs.cellDom.offsetWidth - 32
    let height = Math.floor(width * 0.75)
    this.setState({width, height})
  }

}

export default ImgCell
