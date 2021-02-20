import Taro from '@tarojs/taro'
import getBaseUrl from './baseUrl'
import interceptors from './interceptors'

interceptors.forEach(interceptorItem => Taro.addInterceptor(interceptorItem))

class httpRequest {
  baseOptions(params, method = "GET") {
    let { url, data } = params;
    const BASE_URL = getBaseUrl(url);
    let contentType = "application/json";
    contentType = params.contentType || contentType;
    const option = {
      url: BASE_URL + url,
      data: data,
      method: method,
      header: {
        "content-type": contentType,
        "token": Taro.getStorageSync("token")
      }
    };
    return Taro.request(option);
  }

  get(url, params = "") {
    let option = { url, params };
    return this.baseOptions(option);
  }

  post(url, data, contentType) {
    let pdata = { url, data, contentType };
    return this.baseOptions(pdata, "POST");
  }

  put(url, data = "") {
    let option = { url, data };
    return this.baseOptions(option, "PUT");
  }

  delete(url, data = "") {
    let option = { url, data };
    return this.baseOptions(option, "DELETE");
  }
}

export default new httpRequest()
