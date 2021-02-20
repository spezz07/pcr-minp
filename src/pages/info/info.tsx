import React, { useState } from "react";
import { View, Text, Image, Input, Button } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { AtListItem } from "taro-ui";
import { login } from "../../request/servers";
import "./info.scss";

type loginInfo = {
  avatar: string;
  city: string;
  country: string;
  gender: number;
  userName: string;
  province: string;
  code:string
};

const Info = () => {
  const [userInfo, setUseInfo] = useState({
    userName: "",
    avatar: ""
  });
  const [isLogin, setisLogin] = useState(false);
  const imgBaseUrl = "";
  useDidShow(() => {
    if (Taro.getStorageSync("userInfo")) {
      setUseInfo(Taro.getStorageSync("userInfo"));
      setisLogin(true)
    }else{
      setisLogin(false)
    }
  });
  const toAbout = ()=>{
     Taro.navigateTo({
       url: "/pages/about/about"
     });
  }
  const logout = () =>{
    Taro.removeStorageSync("token")
    Taro.removeStorageSync("userInfo")
    setisLogin(false);
  }
  const getUserInfo = e => {
    Taro.showLoading({
      title: "登录中..."
    });
    if (e.detail.errMsg === "getUserInfo:ok"){
      Taro.login({
        success: function(res) {
          const data: loginInfo = {
            gender: e.detail.userInfo.gender,
            avatar: e.detail.userInfo.avatarUrl,
            code: res.code,
            province: e.detail.userInfo.province,
            city: e.detail.userInfo.city,
            country: e.detail.userInfo.country,
            userName: e.detail.userInfo.nickName
          };
          login(data).then((res2)=>{
            delete data.code
            Taro.setStorageSync("userInfo",data)
            Taro.setStorageSync("token", res2.data.data);
            setUseInfo({userName:data.userName,avatar:data.avatar})
            setisLogin(true)
            Taro.hideLoading()
          }).catch(()=>{
            Taro.hideLoading()
          })
        }
      });
    } else{
      Taro.showToast({
        title:"获取登录信息失败",
        icon:"none",
        duration:5000
        
      })
    }
      
  };
  if (isLogin) {
    return (
      <View className='info'>
        <View className='user-info-container'>
          <View className='user-info-left'>
            <Image className='user-info-avatar' src={userInfo.avatar}></Image>
            <Text className='user-info-name'>{userInfo.userName}</Text>
          </View>
          <View>
            <Button className='logout' onClick={logout}>
              退出登录
            </Button>
          </View>
        </View>
        <AtListItem
          title='关于'
          arrow='right'
          onClick={() => {
            toAbout();
          }}
        />
      </View>
    );
  } else {
    return (
      <View className='info'>
        <View className='user-info-container'>
          <View className='user-info-left'>
            <Image
              className='user-info-avatar'
              src={imgBaseUrl + "/static/defualt-avatar.png"}
            ></Image>
            <Button
              size='default'
              type='primary'
              openType='getUserInfo'
              onGetUserInfo={e => {
                getUserInfo(e);
              }}
              style='margin:0 0 0 18rpx'
              className='btn'
            >
              登录
            </Button>
            <Text className='login-desc-text'>登录后可上传阵容~</Text>
            {/* <View className='at-icon at-icon-edit edit'></View>
            <View>
              <Input
                type='text'
                placeholder='将会获取焦点'
                focus
                className='name-input'
              />
              <View className='btn-area'>
                <Button type='primary' className='btn'>
                  确定
                </Button>
                <Button type='warn' className='btn'>
                  取消
                </Button>
              </View>
            </View> */}
          </View>
        </View>
        <AtListItem
          title='关于'
          arrow='right'
          onClick={() => {
            toAbout();
          }}
        />
      </View>
    );
  }
};

export default Info;
