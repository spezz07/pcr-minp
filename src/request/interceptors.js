import Taro  from "@tarojs/taro"
import { HTTP_STATUS } from './config'

const customInterceptor = (chain) => {

  const requestParams = chain.requestParams

  return chain.proceed(requestParams).then(res => {
    return new Promise((resolve,reject)=>{
        if (res.statusCode === HTTP_STATUS.SUCCESS) {
          if (res.data.code === 400) {
            Taro.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 5000
            });
            Taro.removeStorageSync("token");
            Taro.removeStorageSync("userInfo");
            return resolve(res);
          } else if (res.data.code !== 200) {
            Taro.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 5000
            });
             return reject(res)
          } else {
            return resolve(res)
          }
        } else{
          return reject(res)
        }
    })
    
  })
}

// Taro 提供了两个内置拦截器
// logInterceptor - 用于打印请求的相关信息
// timeoutInterceptor - 在请求超时时抛出错误。
// const interceptors = [customInterceptor, Taro.interceptors.logInterceptor]
const interceptors = [customInterceptor, Taro.interceptors.timeoutInterceptor];
export default interceptors
