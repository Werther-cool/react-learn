/**
 * Created by yang.fan on 2018/1/25.
 */
import React from 'react';
import {Modal, Icon} from 'antd';
import styles  from './imgBoost.less';
import { request } from '../../../config/request'
const { Component } = React

/*
*
* 图片放大组件(新)
*
*   使用方法
*   1、项目引用该文件  import Img from '../../common/imgBoost/indexImg';
*   2、像img标签一样使用就行 <Img src={memberDetailModel.memberDetail.imgUrl}/>
*/
export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {

      //浏览器宽
      winWidth: '0',

      //浏览器高
      winHeight: '0',

      //父元素传递需要展示的图片URL   必填
      src: this.props.src || null,
      //展示图片宽度
      width: this.props.width || '100px',
      //展示图片高度
      height: this.props.height || '100px',
      //是否显示查看大图
      isShow: false,
      //弹窗是否显示
      visible: false,

      //关闭按钮  必填
      closeCbk: ()=>{
        this.props.closeCbk();
      },
    }

  }

  //计算浏览器的宽高
  findDimensions(){
    let w = '0', h = '0';
    //获取窗口宽度
    if (window.innerWidth)
      w = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
      w = document.body.clientWidth;

    //获取窗口高度
    if (window.innerHeight)
      h = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
      h = document.body.clientHeight;

    //通过深入Document内部对body进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
    {
      h = document.documentElement.clientHeight - 50;
      w = document.documentElement.clientWidth;
    }

    //返回宽和高对象
    return {w, h}
  }

  //弹窗的确定按钮
  handleOk(){
    console.log('确定')
  }

  //弹窗的取消按钮
  handleCancel(){
    // console.log('取消');
    let THIS = this;
    this.setState({visible: false})
  }

  //划过样式
  mouseOver(){
    // console.log('划过');
    //防止图片没有加载回来的时候
    if(!this.state.src){
      return false;
    }
    this.setState({isShow: true})
  }

  //离开
  mouseOut(){
    // console.log('离开');
    this.setState({isShow: false})
  }

  //点击放大图标
  onIcon(){
    this.setState({visible: true})
  }

  render() {
    let THIS = this;

    return (
      <div className={(this.props.classN || '') + ' ' + styles.indexImgCss} style={{width:this.state.width, height:this.state.height}}>
        <div
          className={styles.imgCssSpan}
          onMouseOver={this.mouseOver.bind(THIS)}
          onMouseOut={this.mouseOut.bind(THIS)}
        >
          <img src={this.state.src} alt=""/>
          <span style={{display: this.state.isShow?'block':'none'}}>
            <Icon type="eye-o" onClick={this.onIcon.bind(THIS)} title="查看大图"/>
          </span>
        </div>
        <Modal
          visible={this.state.visible}
          title={false}
          onOk={this.handleOk}
          onCancel={this.handleCancel.bind(THIS)}
          width={THIS.state.winWidth/2}
          className={styles.modCss}
          style={{ top: 50 }}
          footer={null}
        >
          <div style={{height: THIS.state.winHeight}}>
            <img src={this.state.src} alt=""/>
          </div>
        </Modal>
      </div>
    )
  }

  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) {
    let THIS = this;

    //浏览器大小改变的时候
    window.onresize = function(){
      //调用获取宽高函数
      let obj = THIS.findDimensions();

      //改变状态
      THIS.setState({winHeight: obj.h,winWidth: obj.w});
    };
  }

  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) {
  }

  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps) {
    // console.log('nextProps: ',nextProps);
    // this.state.propsParameter.selArea = nextProps.selArea;
    // this.setState({});
    this.setState({src: nextProps.src});
  }

  // 插入真实 DOM
  componentDidMount() {
    let THIS = this;
    //调用获取宽高函数
    let obj = THIS.findDimensions();
    //改变状态
    THIS.setState({winHeight: obj.h,winWidth: obj.w});
  }

}
/*
* 引用示例
* 路由：cellarDetails
*
* */
