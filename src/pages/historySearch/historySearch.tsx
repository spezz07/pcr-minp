import React, { useContext, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { observer } from "mobx-react";
import Taro, { useDidShow } from "@tarojs/taro";
import { Stores } from "../../store/store";
import "./historySearch.scss";

const HistroyList = () => {
  const { roleData, changeRoleSelectData } = useContext(
    Stores
  ).Rstore;
  const [historyList, setHistoryList] = useState([]);
  const imgBaseUrl = "";
  useDidShow(() => {
    if (Taro.getStorageSync("historyList")) {
      setHistoryList(Taro.getStorageSync("historyList"));
    }
  });
  const HistoryContent = () => {
    const roleSel = index => {
      Taro.showModal({
        title: "提示",
        content: "确定要查找吗？",
        success: function(res) {
          if (res.confirm) {
            const newSelItem = JSON.parse(JSON.stringify(historyList[index]));
            changeRoleSelectData(newSelItem);
            Taro.switchTab({
              url: "/pages/index/index"
            });
          }
        }
      });
    };
    if (roleData.length === 0 || historyList.length === 0) {
      return (
        <View className='result-content'>
          <View className='empty-c'>
            <Image
              src={imgBaseUrl + "/static/null.png"}
              className='empty-img offten-empty-img'
              mode='aspectFill'
            ></Image>
            <Text className='empty-text'>暂无相关信息</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View className='select-container'>
          {historyList.map((i, index) => {
            return (
              <View
                className='select-item'
                key={index}
                onClick={() => {
                  roleSel(index);
                }}
              >
                {i.map(k => {
                  return (
                    <View key={k.roleImgId} className='item-container'>
                      <Image
                        src={k.imgCloudUrl}
                        className='item-img'
                        mode='aspectFill'
                      />
                      <Text className='item-text'>{k.roleName}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      );
    }
  };
  return (
    <View>
      <HistoryContent />
    </View>
  );
};
export default observer(HistroyList);
