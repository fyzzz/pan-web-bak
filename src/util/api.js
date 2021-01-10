/* eslint-disable */
import axios from 'axios'

let base = '';
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`
  });
}
export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: `${base}${url}`
  });
};
export const isEmpty = (val) => {
  return val == null || val.length === 0
};

import {Message} from 'element-ui'
import {Notification} from 'element-ui'
export const connectSocket = (userId) => {
  if(!userId){
    return;
  }
  let support = false;
  //判断当前浏览器是否支持WebSocket
  if('WebSocket' in window){
    let protocol = window.location.protocol;
    if(protocol === 'http:'){
      window.webSocket = new WebSocket("ws://"+window.location.host+"/socket/api/hod/web/socket/"+userId);
    } else {
      window.webSocket = new WebSocket("wss://"+window.location.host+"/api/hod/web/socket/"+userId);
    }
    support = true;
  } else {
    Message.error('你的浏览器不支持websocket，请切换浏览器。');
  }

  if(support && webSocket){
    //连接成功建立的回调方法
    webSocket.onopen = function(){
      console.log("webSocket连接成功");
    };
    webSocket.onclose = function(){
      console.log("webSocket连接关闭");
    };
    //每个页面接收消息的处理方式都不同
    // webSocket.onmessage = function (event) {
    //   Notification({
    //     dangerouslyUseHTMLString: true,
    //     message: '<p>'+event.data+'</p>',
    //   })
    // };
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function(){
      webSocket.close();
    }
  }
};

