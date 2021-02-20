import React, { useContext, useState, useEffect, useCallback } from "react";
import { View, Text, Image, Button } from "@tarojs/components";
import Taro, { useReady, useDidShow } from "@tarojs/taro";
import { AtList, AtListItem, AtButton, AtPagination } from "taro-ui";
import { observer } from "mobx-react";
import { PageChangeData } from "taro-ui/types/pagination";
import { getRoleList, getFightList, clickLike } from "../../request/servers";
import { Stores } from "../../store/store";
import "./index.scss";

type fightResult = {
  title: string;
  approveNum: number;
  approveStatus: number;
  areaType: number;
  created: string;
  creatorId: string;
  creatorName: string;
  defensive: Array<number>;
  description: string;
  disapproveNum: number;
  offensive: Array<number>;
  rId: number;
  status: number;
};
type roleProps = {
  isCN: number;
  isJP: number;
  isTW: number;
  isSel: boolean;
  roleAlias: string;
  roleDesc: string;
  roleImgId: string;
  roleImgName: string;
  roleImgUrl: string;
  roleName: string;
  roleStar: number;
  roleType: number;
  roleSerachTags: string;
  imgCloudUrl: string;
  isShow: boolean;
  id: number;
};
const Index = () => {
  const {
    roleData,
    addRoleData,
    roleSelectData,
    changeRoleSelectData
  } = useContext(Stores).Rstore;
  // const [rsData, setrsData] = useState<Array<roleProps>>(toJS(roleSelectData));
  const [fightList, setfightList] = useState([]);
  const [pageNo, setpageNo] = useState(1);
  const [total, settotal] = useState(0);
  const [rows, setrows] = useState(5);
  // const [initR, setInitR] = useState(false);
  const [initHis, setInitHis] = useState(false);
  // const [rsStoreData, setRsStoreData] = useState(roleSelectData);
  const [historyList, setHistoryList] = useState([]);
  const imgBaseUrl = "";
  useReady(() => {
    Taro.showLoading({
      title: "加载中"
    });
    Taro.showShareMenu({
      withShareTicket: true,
      //@ts-ignore
      menus: ["shareAppMessage", "shareTimeline"]
    });
   
    getRoleList({ rows: 999, pageNo: 1 })
      .then(res => {
        addRoleData(res.data.data);
        function getCUrl(id){
          for(let i = 0;i<res.data.data.length;i++){
              if(res.data.data[i].unitId == id){
                return res.data.data[i].imgCloudUrl
              }
          }
        }
        if (Taro.getStorageSync("historyList")) {
          if (!Taro.getStorageSync("historyList")[0][0].imgCloudUrl) {
              let hList:Array<Array<any>> = Taro.getStorageSync("historyList");
              hList.forEach((i,index)=>{
                  i.forEach((k)=>{
                    k.imgCloudUrl = getCUrl(k.unitId)
                  })
              })
              Taro.setStorageSync("historyList",hList);
              setHistoryList(Taro.getStorageSync("historyList").slice(0, 3));
          } else {
            setHistoryList(Taro.getStorageSync("historyList").slice(0, 3));
          }
        }
        setInitHis(true);
        Taro.hideLoading();
        Taro.showToast({
           title: "如需进行更详细的查询可前往https://www.pcrdfans.com/battle",
           duration: 5000,
           icon: "none"
         });
      })
      .catch(e => {
        Taro.hideLoading();
        Taro.showToast({
          title: e.errMsg,
          icon: "none",
          duration: 5000
        });

        return;
      });
  });
  const toRoleTable = () => {
    Taro.navigateTo({
      url: "/pages/roleTable/roleTable"
    });
  };
  const toAdd = () => {
    if (!Taro.getStorageSync("token")) {
      Taro.showToast({
        title: "请先登录！",
        icon: "none"
      });
      return;
    }
    Taro.navigateTo({
      url: "/pages/addBattle/addBattle"
    });
  };
  useDidShow(() => {
    if (roleSelectData.length > 0) {
      // console.log(roleSelectData);
      // setrsData(toJS(roleSelectData));
    }
  });

  const getHisResult = index => {
    changeRoleSelectData(historyList[index]);
    // roleSelectData.replace(historyList[index]);
  };
  // 查询阵容
  const getResult = useCallback(
    (local?: boolean) => {
      if (roleSelectData.length === 0 && !local) {
        Taro.showToast({
          title: "请选择阵容！",
          icon: "none"
        });
        return;
      }
      const defensive = roleSelectData.map(i => {
        return i.unitId;
      });
      defensive.sort((a, b) => {
        return a - b;
      });
      Taro.showLoading({
        title: "查询中..."
      });
      getFightList({ rows: 5, pageNo: 1, defensive }).then(res => {
        // Taro.hideLoading();
        if (res.data.data == null) return;
        if (res.data.data.length === 0) {
          Taro.showToast({
            title: "无相关阵容数据",
            icon: "none",
            duration: 5000
          });
        }
        Taro.hideLoading();
        const isEq = (
          arr1: Array<number>,
          arr2: Array<Array<number>>
        ): Boolean => {
          // O2
          for (let i = 0; i < arr2.length; i++) {
            if (arr1.length != arr2[i].length) return false;
            for (let k = 0; k < arr2[i].length; k++) {
              if (JSON.stringify(arr1) == JSON.stringify(arr2[i])) return true;
            }
          }
          return false;
        };
        setfightList(res.data.data);
        setrows(5);
        setpageNo(1);
        settotal(res.data.total);
        if (historyList.length) {
          let oList: Array<any> = Taro.getStorageSync("historyList").map(
            i => i
          );
          let oCodeList: Array<any> = [];
          oList.forEach(i => {
            let unit = i.map(k => {
              return k.unitId;
            });
            oCodeList.push(unit);
          });
          let selectUnitId = roleSelectData.map(i => {
            return i.unitId;
          });
          if (isEq(selectUnitId, oCodeList)) return;
          oList.unshift(roleSelectData);
          if (oList.length > 50) {
            oList.splice(oList.length - 1, 1);
          }
          Taro.setStorageSync("historyList", oList);
          setHistoryList(Taro.getStorageSync("historyList").slice(0, 3));
        } else {
          Taro.setStorageSync("historyList", [roleSelectData]);
          setHistoryList([roleSelectData]);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roleSelectData]
  );
  useEffect(() => {
    if (initHis && roleSelectData.length > 0) {
      getResult(true);
    }
  }, [getResult, initHis, roleSelectData]);
  // 阵容选择卡片
  const SelectCard = () => {
    return (
      <View>
        <View className='content-head'>
          <View className='content-tag-c'>
            <View className='content-tag'></View>
            <Text className='content-title'>阵容选择</Text>
          </View>
        </View>
        <View className='content-card'>
          <AtList>
            <AtListItem
              title='上传阵容'
              arrow='right'
              onClick={() => {
                toAdd();
              }}
            />
          </AtList>
          <AtList>
            <AtListItem
              title='查询阵容'
              arrow='right'
              onClick={() => {
                toRoleTable();
              }}
            />
          </AtList>
          <View className='select-container'>
            <View className='select-item'>
              {roleSelectData.map(i => {
                return (
                  <Image
                    key={i.roleImgId}
                    src={i.imgCloudUrl}
                    className='item-img'
                    mode='aspectFill'
                  />
                );
              })}
            </View>
            <AtButton
              type='primary'
              size='small'
              className='select-btn'
              onClick={() => {
                getResult();
              }}
            >
              查询
            </AtButton>
          </View>
          <FightResult />
        </View>
      </View>
    );
  };
  // 历史卡片
  const HistorySearch = () => {
    const HistoryContent = () => {
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
                    getHisResult(index);
                  }}
                >
                  {i.map(k => {
                    return (
                      <Image
                        key={k.roleImgId}
                        src={k.imgCloudUrl}
                        className='item-img'
                        mode='aspectFill'
                      />
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
        <View className='content-head'>
          <View className='content-tag-c'>
            <View className='content-tag'></View>
            <Text className='content-title'>历史查找</Text>
          </View>
          <View
            onClick={() => {
              toHistory();
            }}
          >
            <Text className='content-title-more'>查看更多 </Text>
          </View>
        </View>

        <View className='content-card'>
          <HistoryContent />
        </View>
      </View>
    );
  };

  const toHistory = () => {
    Taro.navigateTo({
      url: "/pages/historySearch/historySearch"
    });
  };
  const filterRoleImg = (id: number): string => {
    const item = roleData.filter(i => {
      return i.unitId == id;
    });
    return item[0].imgCloudUrl;
  };
  const FightResult = () => {
    // 阵容下一页
    const changePageList = (e: PageChangeData) => {
      Taro.showLoading({
        title: "加载中"
      });
      getFightList({ rows: 5, pageNo: e.current }).then(res => {
        setfightList(res.data.data);
        //  setrows(5);
        setpageNo(res.data.pageNo);
        settotal(res.data.total);
        Taro.hideLoading();
      });
    };
    const cLike = (id, index, type) => {
      let fList: Array<fightResult> = fightList.map(i => i);
      let likeItem = fList[index];
      const changeNum = () => {
        if (type === 1) {
          // 0 无 1 赞成 2 反对
          likeItem.approveNum++;
          if (likeItem.disapproveNum - 1 <= 0) {
            likeItem.disapproveNum = 0;
          } else {
            likeItem.disapproveNum--;
          }
        } else {
          likeItem.disapproveNum++;
          if (likeItem.approveNum - 1 <= 0) {
            likeItem.approveNum = 0;
          } else {
            likeItem.approveNum--;
          }
        }
        likeItem.approveStatus = type;
      };
      if (likeItem.approveStatus === 0) {
        if (type === 1) {
          likeItem.approveNum++;
        } else {
          likeItem.disapproveNum--;
        }
        likeItem.approveStatus = type;
      } else {
        if (type === likeItem.approveStatus) {
          // 0 无 1 赞成 2 反对
          likeItem.approveStatus = 0;
          if (type === 1) {
            // 0 无 1 赞成 2 反对
            if (likeItem.approveNum - 1 <= 0) {
              likeItem.approveNum = 0;
            } else {
              likeItem.approveNum--;
            }
          } else {
            if (likeItem.disapproveNum - 1 <= 0) {
              likeItem.disapproveNum = 0;
            } else {
              likeItem.disapproveNum--;
            }
          }
        } else {
          changeNum();
        }
      }

      setfightList(fList);
      clickLike({ status: type, fightResultId: id });
    };
    if (fightList.length === 0 || roleData.length === 0) {
      return (
        <View className='result-content'>
          <View className='empty-c'>
            <Image
              src={imgBaseUrl + "/static/null.png"}
              className='empty-img'
              mode='aspectFill'
            ></Image>
            <Text className='empty-text'>暂无相关信息</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View className='result-content'>
          {fightList.map((i: fightResult, index) => {
            return (
              <View className='fight-result-item' key={i.rId}>
                {i.offensive.map(id => {
                  return (
                    <Image
                      key={id}
                      src={filterRoleImg(id)}
                      className='item-img'
                      mode='aspectFill'
                    />
                  );
                })}
                <View className='win-img'>
                  <Image
                    src={imgBaseUrl + "/static/win.png"}
                    className='win-img-pic'
                    mode='aspectFill'
                  ></Image>
                </View>
                {i.defensive.map(id => {
                  return (
                    <Image
                      key={id}
                      src={filterRoleImg(id)}
                      className='item-img'
                      mode='aspectFill'
                    />
                  );
                })}
                <View className='fight-result-container'>
                  <Text className='fight-result-title'>
                    {i.title} <Text className='avatar'>{i.creatorName}</Text>
                  </Text>
                  <Text
                    className='fight-result-desc'
                    style={i.description ? "" : "display:none"}
                  >
                    {i.description}
                  </Text>
                  <View className='fight-result-exinfo'>
                    <Text className='times'>{i.created}</Text>
                    <View className='approve-v'>
                      <View
                        className='approve-icon'
                        onClick={() => {
                          cLike(i.rId, index, 2);
                        }}
                      >
                        <Image
                          src={
                            i.approveStatus == 2
                              ? imgBaseUrl + "/static/ok-f.png"
                              : imgBaseUrl + "/static/dis.png"
                          }
                          mode='aspectFit'
                          className={
                            i.approveStatus === 2
                              ? "approve-icon-img  icon-rotate"
                              : "approve-icon-img"
                          }
                        />
                        <Text className='approve-num'>{i.disapproveNum}</Text>
                      </View>
                      <View
                        className='approve-icon'
                        onClick={() => {
                          cLike(i.rId, index, 1);
                        }}
                      >
                        <Image
                          src={
                            i.approveStatus == 1
                              ? imgBaseUrl + "/static/ok-f.png"
                              : imgBaseUrl + "/static/dis.png"
                          }
                          mode='aspectFit'
                          className={
                            i.approveStatus === 1
                              ? "approve-icon-img"
                              : "approve-icon-img  icon-rotate"
                          }
                        />
                        <Text className='approve-num'>{i.approveNum}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
          <AtPagination
            icon
            total={total}
            pageSize={rows}
            current={pageNo}
            customStyle='margin-top:28rpx'
            onPageChange={e => {
              changePageList(e);
            }}
          ></AtPagination>
        </View>
      );
    }
  };

  return (
    <View className='index'>
      <HistorySearch />
      <SelectCard />
    </View>
  );
};

export default observer(Index);
