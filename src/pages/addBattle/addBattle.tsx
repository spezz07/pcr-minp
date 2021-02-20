import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Radio,
  RadioGroup,
  Textarea,
  Input
} from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";

import { AtButton, AtFab, AtFloatLayout, AtInput, AtForm } from "taro-ui";
import { Stores } from "../../store/store";
import { battleAdd } from "../../request/servers";
import "./addBattle.scss";

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
  isShow: boolean;
  pos: number;
  id: number;
  imgCloudUrl: string;
  unitId: number;
};

type roleState = {
  searchKey: string;
  roleData: Array<roleProps>;
  roleShowData: Array<roleProps>;
  roleType: Array<number>;
  roleSelect: Array<roleProps>;
  toastText: string;
  toastOpen: boolean;
};

type fightResultInfo = {
  offensive: Array<number>;
  defensive: Array<number>;
  mappingString: string;
  areaType: number;
  description: string;
  title: string;
};
const AddBattle = () => {
  const { roleData } = useContext(Stores).Rstore;
  const imgBaseUrl = "";
  let [offList, setOffList] = useState<Array<roleProps>>([]);
  let [defList, setDefList] = useState<Array<roleProps>>([]);
  let [offRoleList, setOffRoleList] = useState<Array<roleProps>>([]);
  let [defRoleList, setDefRoleList] = useState<Array<roleProps>>([]);
  let [offenStatus, setOffenStatus] = useState(true);
  let [searchKey, setSearchKey] = useState("");
  let [dialogShow, setDialogShow] = useState(false);
  useDidShow(() => {
    const data: Array<roleProps> = roleData;
    let rData: Array<roleProps> = data.map((i: roleProps) => {
      let joinStr = i.roleName + "," + i.roleAlias;
      i.roleSerachTags = joinStr;
      i.isShow = true;
      i.isSel = false;
      return i;
    });
    setOffRoleList(JSON.parse(JSON.stringify(rData)));
    setDefRoleList(JSON.parse(JSON.stringify(rData)));
  });
  const sortRole = (v: Array<roleProps>) => {
    v.sort((a, b) => {
      if (b.pos === a.pos) {
        return b.unitId - a.unitId;
      }
      return b.pos - a.pos;
    });
  };
  const roleSelectHandle = (id: number) => {
    const handleSelList = offenStatus ? offList : defList;
    const handleRoleList = offenStatus ? offRoleList : defRoleList;
    let roleIndex = handleRoleList.findIndex(i => {
      return i.id == id;
    });
    let index = handleSelList.findIndex(i => {
      return i.id == id;
    });
    if (index == -1) {
      if (handleSelList.length < 5) {
        let rDate = handleSelList.map(i => {
          return i;
        });
        let sData = handleRoleList.map((i, index2) => {
          if (index2 === roleIndex) {
            i.isSel = true;
          }
          return i;
        });
        rDate.push(handleRoleList[roleIndex]);
        sortRole(rDate);
        if (offenStatus) {
          setOffRoleList(sData);
          setOffList(rDate);
        } else {
          setDefRoleList(sData);
          setDefList(rDate);
        }
      } else {
        Taro.showToast({
          title: "角色最多为5个",
          duration: 5000,
          icon: "none"
        });
      }
    } else {
      let rDate = handleSelList.map(i => {
        return i;
      });
      let sData = handleRoleList.map((i, index2) => {
        if (index2 === roleIndex) {
          i.isSel = false;
        }
        return i;
      });
      rDate.splice(index, 1);
      sortRole(rDate);
      if (offenStatus) {
        setOffRoleList(sData);
        setOffList(rDate);
      } else {
        setDefRoleList(sData);
        setDefList(rDate);
      }
    }
  };
  const onlySearchKey = () => {
    const handleRoleList = offenStatus ? offRoleList : defRoleList;
    if (!searchKey) {
      const sData = handleRoleList.map(i => {
        i.isShow = true;
        return i;
      });
      if (offenStatus) {
        setOffRoleList(sData);
      } else {
        setDefRoleList(sData);
      }
      return;
    }
    const sData = handleRoleList.map(i => {
      if (i.roleSerachTags.indexOf(searchKey) > -1) {
        i.isShow = true;
      } else {
        i.isShow = false;
      }
      return i;
    });
    if (offenStatus) {
      setOffRoleList(sData);
    } else {
      setDefRoleList(sData);
    }
  };
  const roleSelectItemClick = (id: number) => {
    const handleSelList = offenStatus ? offList : defList;
    const handleRoleList = offenStatus ? offRoleList : defRoleList;
    let roleIndex = handleRoleList.findIndex(i => {
      return i.id == id;
    });
    let index = handleSelList.findIndex(i => {
      return i.id == id;
    });
    let rDate = handleSelList.map(i => {
      return i;
    });
    let sData = handleRoleList.map((i, index2) => {
      if (index2 === roleIndex) {
        i.isSel = false;
      }
      return i;
    });
    rDate.splice(index, 1);
    sortRole(rDate);
    if (offenStatus) {
      setOffRoleList(sData);
      setOffList(rDate);
    } else {
      setDefRoleList(sData);
      setDefList(rDate);
    }
  };
  const onSerachChange = (val: any) => {
    setSearchKey(val.detail.value);
  };
  useEffect(() => {
    if (offenStatus) {
      Taro.showToast({
        title: "请选择进攻阵容",
        icon: "none"
      });
    } else {
      Taro.showToast({
        title: "请选择防守阵容",
        icon: "none"
      });
    }
  }, [offenStatus]);
  const changeBattleStatus = () => {
    setOffenStatus(!offenStatus);
  };
  const switchTeam = () => {
    if (offList.length === 0 || defList.length == 0) {
      Taro.showToast({
        title: "请选择阵容",
        icon: "none"
      });
      return;
    }
    Taro.showModal({
      title: "提示",
      content: "确定交换阵容吗？",
      success: function(res) {
        if (res.confirm) {
          let nOffList = JSON.parse(JSON.stringify(offList));
          let nDefList = JSON.parse(JSON.stringify(defList));
          let nOffRoleList = JSON.parse(JSON.stringify(offRoleList));
          let nDefRoleList = JSON.parse(JSON.stringify(defRoleList));      
          setOffList(nDefList);
          setOffRoleList(nDefRoleList);
          setDefList(nOffList);
          setDefRoleList(nOffRoleList);
        }
      }
    });
  };
  const SelRoleItem = () => {
    /* 吸顶 */
    return (
      <View className='select-container'>
        <View className='search-bar-container'>
          <Input
            type='text'
            placeholder='请输入需要查找的角色名或别名'
            value={searchKey}
            className='search-bar'
            onInput={e => {
              onSerachChange(e);
            }}
          />
          <AtButton
            type='primary'
            size='small'
            className='serach-btn'
            onClick={() => {
              onlySearchKey();
            }}
          >
            确定
          </AtButton>
        </View>

        {/* <AtSearchBar
          className='search-bar'
          showActionButton
          focus={false}
          value={searchKey}
          onChange={e => {
            onSerachChange(e);
          }}
          onFocus={e =>{
            onfou(e);
          }}
          onActionClick={() => {
            onlySearchKey();
          }}
          placeholder='请输入需要查找的角色名或别名'
        /> */}
        <Text className='select-title'>进攻阵容</Text>
        <View
          className='select-item'
          style={offList.length > 0 ? "" : "padding:0"}
        >
          {offList.map(i => {
            return (
              <Image
                key={i.roleImgId}
                src={i.imgCloudUrl}
                className='item-img'
                mode='aspectFill'
                onClick={() => {
                  roleSelectItemClick(i.id);
                }}
              />
            );
          })}
        </View>
        <View className='win-img'>
          <Image
            src={imgBaseUrl + "/static/win.png"}
            className='win-img-pic'
            mode='aspectFill'
          ></Image>
        </View>
        <Text className='select-title'>防守阵容</Text>
        <View
          className='select-item'
          style={defList.length > 0 ? "" : "padding:0"}
        >
          {defList.map(i => {
            return (
              <Image
                key={i.roleImgId}
                src={i.imgCloudUrl}
                className='item-img'
                mode='aspectFill'
                onClick={() => {
                  roleSelectItemClick(i.id);
                }}
              />
            );
          })}
        </View>
      </View>
    );
  };
  const TableItem = () => {
    let roleList = offenStatus ? offRoleList : defRoleList;
    const imgItem = (i: {
      isCN?: number;
      isJP?: number;
      isTW?: number;
      isSel: any;
      roleAlias?: string;
      roleDesc?: string;
      roleImgId: any;
      roleImgName?: string;
      roleImgUrl: any;
      roleName: any;
      roleStar?: number;
      roleType?: number;
      roleSerachTags?: string;
      imgCloudUrl?: string;
      isShow: any;
      id: any;
    }) => {
      return (
        <View
          className='role-table-item'
          key={i.roleImgId}
          style={i.isShow ? "" : "display:none"}
        >
          <Image
            src={i.imgCloudUrl}
            className={"item-img" + `${i.isSel ? " item-sel" : ""}`}
            mode='aspectFill'
            onClick={() => {
              roleSelectHandle(i.id);
            }}
          />
          <Text className='item-text'>{i.roleName}</Text>
        </View>
      );
    };
    return (
      <View className='role-table-content' style='margin-bottom:156rpx'>
        <Text className='role-table-title'>前卫</Text>
        {roleList.map(i => {
          return i.roleType === 1 && imgItem(i);
        })}
        <Text className='role-table-title'>中卫</Text>
        {roleList.map(i => {
          return i.roleType === 2 && imgItem(i);
        })}
        <Text className='role-table-title'>后卫</Text>
        {roleList.map(i => {
          return i.roleType === 3 && imgItem(i);
        })}
      </View>
    );
  };
  const SubmitLayout = () => {
    let pData: fightResultInfo = {
      offensive: [],
      defensive: [],
      title: "",
      description: "",
      mappingString: "",
      areaType: 1
    };
    let [title, setTitle] = useState("");
    let [description, setDescription] = useState("");
    let [areaType, setAreaType] = useState("1");
    const titleChange = val => {
      setTitle(val);
      return val;
    };
    const closeSubLayout = () => {
      setTitle("");
      setDescription("");
      setAreaType("1");
      setDialogShow(false);
    };
    const descChange = val => {
      console.log(val);
      setDescription(val);
      return val;
    };

    const typeChange = val => {
      setAreaType(val.detail.value);
    };
    const submit = () => {
      //   if (offList.length === 0) {
      //     Taro.showToast({
      //       title: "请选择进攻阵容",
      //       icon: "none"
      //     });
      //     return;
      //   }
      //   if (defList.length === 0) {
      //     Taro.showToast({
      //       title: "请选择防守阵容",
      //       icon: "none"
      //     });
      //     return;
      //   }
      const mapping = {
        offensive: [],
        defensive: []
      };
      pData.offensive = offList.map(i => {
        mapping.offensive.push({
          roleName: i.roleName,
          id: i.id,
          uid: i.unitId
        });
        return i.unitId;
      });
      pData.defensive = defList.map(i => {
        mapping.defensive.push({
          roleName: i.roleName,
          id: i.id,
          uid: i.unitId
        });
        return i.unitId;
      });
      pData.title = title;
      pData.description = description;
      pData.areaType = Number(areaType);
      pData.mappingString = JSON.stringify(mapping);
      Taro.showModal({
        title: "提示",
        content: "确定要提交吗？",
        success: function(res) {
          if (res.confirm) {
            Taro.showLoading({
              title: "提交中..."
            });
            battleAdd(pData)
              .then(res2 => {
                Taro.hideLoading();
                if (res2.data.code !== 200) {
                  Taro.showToast({
                    title: res2.data.desc,
                    duration: 5000
                  });
                } else {
                  Taro.showToast({
                    title: "提交成功！",
                    duration: 5000
                  });
                  closeSubLayout();
                }
              })
              .catch(e => {
                console.error(e.data.msg);
              });
          } else if (res.cancel) {
          }
        }
      });
    };
    return (
      <AtFloatLayout
        isOpened={dialogShow}
        title='添加阵容'
        onClose={() => {
          closeSubLayout();
        }}
      >
        <View>
          <AtForm>
            <AtInput
              name='title'
              title='标题:'
              type='text'
              placeholder='请输入标题'
              value={title}
              onChange={v => {
                titleChange(v);
              }}
            />
            <AtInput
              name='desc'
              title='简介:'
              type='text'
              placeholder='请输入简介'
              value={description}
              onChange={v => {
                descChange(v);
              }}
            />
            {/* <Textarea
              value={description}
              className='desc-textarea'
              
              onInput={(v)=>{ descChange(v);}}
              placeholder='请输入阵容简介'
            ></Textarea> */}

            <View className='type-radio'>
              <Text>服务器：</Text>
              <RadioGroup
                onChange={v => {
                  typeChange(v);
                }}
              >
                <Radio value='1' checked={areaType == "1"}>
                  国服
                </Radio>
                <Radio value='2' checked={areaType == "2"}>
                  台服
                </Radio>
                <Radio value='3' checked={areaType == "3"}>
                  日服
                </Radio>
              </RadioGroup>
            </View>
          </AtForm>
          <AtButton
            type='primary'
            size='small'
            customStyle='width:94%'
            onClick={() => {
              submit();
            }}
          >
            确定
          </AtButton>
        </View>
      </AtFloatLayout>
    );
  };

  return (
    <View className='battle'>
      <View>
        {/* {searchBar} */}
        <SelRoleItem />
        <TableItem />
        <View className='fab-bar'>
          <AtFab
            size='small'
            onClick={() => {
              changeBattleStatus();
            }}
          >
            <Image
              src={
                offenStatus
                  ? imgBaseUrl + "/static/offen.png"
                  : imgBaseUrl + "/static/defen.png"
              }
              className='fab-img'
              mode='aspectFit'
            />
          </AtFab>
        </View>
        <View className='fab-bar2'>
          <AtFab
            size='small'
            onClick={() => {
              switchTeam();
            }}
          >
            <Image
              src={imgBaseUrl + "/static/switch.png"}
              className='fab-img'
              mode='aspectFit'
            />
          </AtFab>
        </View>
      </View>
      <View className='bottom-bar'>
        <AtButton
          type='primary'
          size='small'
          customStyle='width:94%'
          onClick={() => {
            setDialogShow(true);
          }}
        >
          添加阵容
        </AtButton>
      </View>
      <SubmitLayout />
    </View>
  );
};
AddBattle.config = {
  navigationBarTitleText: "添加阵容"
};

export default AddBattle;
