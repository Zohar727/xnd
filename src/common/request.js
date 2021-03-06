/**
 * Http 请求通用函数封装
 */
import axios from 'axios'

String.prototype.format = function (args) {
  var result = this
  if (arguments.length > 0) {
    if (arguments.length === 1 && typeof (args) === 'object') {
      for (var key in args) {
        if (args[key] !== undefined) {
          var reg = new RegExp('({' + key + '})', 'g')
          result = result.replace(reg, args[key])
        }
      }
    } else {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) {
          var reg = new RegExp('({)' + i + '(})', 'g')
          result = result.replace(reg, arguments[i])
        }
      }
    }
  }
  return result
}

var preFix = '/api'
/**
 * [api请求地址]
 * @key {string} 路由名称
 * @value {Object}
 */
var urls = {
  Login: '/v1/login',
  UserInfo: '/v1/user/{uid}'
}

/*
    获取目标url

    router: 路由对象
 */
var getUrl = function (router) {
  let bindObj = {uid: localStorage.getItem('id')}
  return preFix + urls[router.name].format(bindObj)
}

/*
    http get 请求封装
    method: 请求http方式
    router: 路由对象
    data: http 请求body数据
    successFun: 成功回调函数
    errorFun: 错误回调函数,可不传
    router: 跳转路由
 */
var request = function (method, router, data, successFun, errorFun) {
  axios.request({
    method: method,
    url: getUrl(router),
    data: data,
    timeout: 5000,
    headers: {
      'Authorization': localStorage.getItem('token')
    }
  })
  .then(function (response) {
    console.log('成功')
    // 自定义成功处理函数
    if (successFun) {
      successFun(response.data)
    } else {
      let rst = response.data
      // 有错误码返回,提示错误信息
      if (rst.code) {
        alert(rst.msg)
      }
    }
  })
  .catch(function (error) {
    console.log('失败')
    if (error.response) {
      // 特殊情况统一处理
      if (error.response.data &&
        error.response.data.code === 3) {
        // 未登录或者登录已经过期
        router.push({path: '/login'})
      }
      // 自定义错误函数
      if (errorFun) {
        errorFun(error)
      } else {
      // 默认错误处理函数
        let msg = error.response.data.msg
        if (msg instanceof Object) {
          alert(JSON.stringify(msg))
        } else {
          alert(msg)
        }
      }
    }
  })
}

/*
    http get 请求封装
 */
var get = function (router, successFun, errorFun) {
  request('get', router, {}, successFun, errorFun)
}

/*
    http post 请求封装
 */
var post = function (router, data, successFun, errorFun) {
  request('post', router, data, successFun, errorFun)
}

/*
    http get 请求封装
 */
var put = function (router, data, successFun, errorFun) {
  request('put', router, data, successFun, errorFun)
}

/*
    http get 请求封装
 */
var patch = function (router, data, successFun, errorFun) {
  request('patch', router, data, successFun, errorFun)
}

export default {
  get: get,
  post: post,
  put: put,
  patch: patch
}
