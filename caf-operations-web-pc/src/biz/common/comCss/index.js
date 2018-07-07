/**
 * Created by yang.fan on 2018/4/4.
 */

/*
 *
 * 详情页面公用样式组件
 *
 * */
/*
* 使用说明
* 0、import ComHtml from '../../../common/comCss/index'
*   格式：
*     <ComHtml
        data={{
          arrName: ['用户账号', '姓名', '工号', '工作电话', '手机号'],
          arrValue: [userName, realName, number, telephone, phone],
        }}
      />

* 1、arrName  需要展示的名称数组
* 2、arrValue 需要展示名称对应值的数组
* （arrName、arrValue要一一对应 !!!!!!!!!）
* 3、注释带*表示该字段是必填属性
* */

import React from 'react'
import styles  from './comCss.less'
import {Form, Input, Select, Checkbox} from 'antd';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;
import { request } from '../../../config/request'
import {cloneDeep} from 'lodash'
const { Component } = React

export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: this.props.data || {
        arrName: [], //*名称数组
        arrValue: [], //*值数组
      }
    }
  }

  //构造二维数组
  structureArr(arr){
    let newArr = [], arrLength = arr.length;
    //先判断需要组合的数组是否有值
    if(arrLength <= 0) return newArr;

    //计算二维数组的长度
    let erLength = parseInt(arrLength/2) + parseInt(arrLength%2);

    //构造空的二维数组
    for(let i=0; i<erLength; i++){
      newArr.push([]);
    }

    //给空的二维数组赋值
    let arrIdx = 0;
    for(let j=0; j<newArr.length; j++){
      newArr[j][0] = arr[j + parseInt(arrIdx)];
      arrIdx += 1;//往后一位数取值

      //判断后一位是否有值
      if(arr[j + parseInt(arrIdx)]){
        newArr[j][1] = arr[j + parseInt(arrIdx)];
      }
    }
    return newArr
  }

  render() {
    let THIS = this;
    let {arrName, arrValue} = this.state.data;
    let newArrName = this.structureArr(arrName);
    let newArrValue = this.structureArr(arrValue);

    return (
      <div>
        {
          newArrName.map((arrs, i)=>{
            if(arrs.length >= 2){
              return <div key={'arrs_' + i} className={0 == i?styles.comLi + ' ' + styles.comLi_top:styles.comLi}>
                <div className={styles.comLi_left}>
                  <div className={styles.comLi_name}>{arrs[0]}：</div>
                  <div className={styles.comLi_content}>{newArrValue[i][0]}</div>
                </div>
                <div className={styles.comLi_right}>
                  <div className={styles.comLi_name}>{arrs[1]}：</div>
                  <div className={styles.comLi_content}>
                    {newArrValue[i][1]}
                  </div>
                </div>
              </div>

            }else{
              return <div key={'arrs_' + i} className={styles.comLi}>
                <div className={styles.comLi_name}>{arrs[0]}：</div>
                <div className={styles.comLi_content}>{newArrValue[i][0]}</div>
              </div>
            }
          })
        }
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
    // console.log('新属性: ', nextProps);
    if(nextProps.data){
      this.state.data = nextProps.data;
      this.setState({});
      // this.setState({...nextProps});
    }
  }

  componentDidMount() {
  }

}
