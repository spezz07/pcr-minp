import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text, Image, Input } from "@tarojs/components";
import { AtButton, AtToast } from "taro-ui";
import { inject, observer } from "mobx-react";
import { CompProps } from "../../store";
import "./roleTable.scss";

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
  pos:number;
  id: number;
  unitId:number;
  imgCloudUrl:string;
};

type roleState = {
  searchKey: string;
  roleData: Array<roleProps>;
  roleShowData: Array<roleProps>;
  roleType: Array<number>;
  roleSelect: Array<roleProps>;
  toastText:string
  toastOpen:boolean
};



@inject("store")
@observer
class RoleTable extends Component<CompProps, roleState> {
  // constructor(props: any) {
  //   super(props)
  // }
  state: roleState = {
    searchKey: "",
    roleData: [],
    roleType: [1, 2, 3],
    roleShowData: [],
    roleSelect: [],
    toastText: "",
    toastOpen: false
  };
  componentDidMount() {
    const data: Array<roleProps> = this.props.store.Rstore.roleData;
    let rData: Array<roleProps> = data.map((i: roleProps) => {
      let joinStr = i.roleName + "," + i.roleAlias;
      i.roleSerachTags = joinStr;
      i.isShow = true;
      i.isSel = false;
      return i;
    });
    this.setState({
      roleData: rData,
      roleShowData: JSON.parse(JSON.stringify(rData))
    });
  }
  componentDidShow() {
    if (this.props.store.Rstore.roleSelectData.length > 0) {
      // 还原
      const selId = this.props.store.Rstore.roleSelectData.map(i => {
        return i.id;
      });
      let rData = this.state.roleShowData.map(i => {
        if (selId.includes(i.id)) {
          i.isSel = true;
        }
        return i;
      });
      this.setState({
        roleShowData: rData,
        roleSelect: this.props.store.Rstore.roleSelectData
      });
    }
  }
  toIndex = () => {
    if (this.state.roleSelect.length === 0) {
      this.setState({
        toastText: "请选择阵容！",
        toastOpen: true
      });
      return;
    }
    this.props.store.Rstore.changeRoleSelectData(this.state.roleSelect);
    Taro.switchTab({
      url: "/pages/index/index"
    });
  };
  listSearchHandle(key, type) {
    if (!key && type.length == 3) {
      //   console.log(1);
      this.setState({
        searchKey: "",
        roleType: type,
        roleShowData: this.state.roleData.map(i => {
          i.isShow = true;
          return i;
        })
      });
      return;
    } else if (!key && type.length < 3) {
      //   console.log(2);
      this.onlyType(type);
    } else if (key && type.length == 3) {
      //   console.log(3);
      this.onlySearchKey(key, type);
    } else {
      //   console.log(4);
      this.hasSearchTypeKey(type, key);
    }
  }
  hasSearchTypeKey(type: Array<number>, searchKey: string) {
    const roleShowData = this.state.roleShowData.map(i => {
      if (
        i.roleSerachTags.indexOf(searchKey) > -1 &&
        type.includes(i.roleType)
      ) {
        i.isShow = true;
      } else {
        i.isShow = false;
      }
      return i;
    });
    this.setState({
      searchKey,
      roleShowData,
      roleType: type
    });
  }
  onlySearchKey(searchKey: string, type: any) {
    const roleShowData = this.state.roleShowData.map(i => {
      if (i.roleSerachTags.indexOf(searchKey) > -1) {
        i.isShow = true;
      } else {
        i.isShow = false;
      }
      return i;
    });
    this.setState({
      searchKey,
      roleShowData,
      roleType: type
    });
  }
  onlyType(type: number[]) {
    const roleShowData = this.state.roleShowData.map(i => {
      if (!type.includes(i.roleType)) {
        i.isShow = false;
      } else {
        i.isShow = true;
      }
      return i;
    });
    this.setState({
      roleType: type,
      roleShowData
    });
  }
  changeRoleType = (type: number) => {
    let roleType = this.state.roleType.map(i => {
      return i;
    });
    if (roleType.includes(type)) {
      roleType.splice(roleType.indexOf(type), 1);
    } else {
      roleType.push(type);
    }
    this.listSearchHandle(this.state.searchKey, roleType);
  };
  sortRole(v: Array<roleProps>) {
    v.sort((a, b) => {
      if (b.pos === a.pos) {
        return b.unitId - a.unitId;
      }
      return b.pos - a.pos;
    });
  }
  roleSelectItemClick = (id: number) => {
    let roleIndex = this.state.roleShowData.findIndex(i => {
      return i.unitId == id;
    });
    let index = this.state.roleSelect.findIndex(i => {
      return i.unitId == id;
    });
    let rDate = this.state.roleSelect.map(i => {
      return i;
    });
    let sData = this.state.roleShowData.map((i, index2) => {
      if (index2 === roleIndex) {
        i.isSel = false;
      }
      return i;
    });
    rDate.splice(index, 1);
    this.sortRole(rDate);
    this.setState({
      roleShowData: sData,
      roleSelect: rDate
    });
  };
  roleSelectHandle = (id: number) => {
    let roleIndex = this.state.roleShowData.findIndex(i => {
      return i.unitId == id;
    });
    let index = this.state.roleSelect.findIndex(i => {
      return i.unitId == id;
    });
    if (index == -1) {
      if (this.state.roleSelect.length < 5) {
        let rDate = this.state.roleSelect.map(i => {
          return i;
        });
        let sData = this.state.roleShowData.map((i, index2) => {
          if (index2 === roleIndex) {
            i.isSel = true;
          }
          return i;
        });
        rDate.push(this.state.roleShowData[roleIndex]);
        this.sortRole(rDate);
        this.setState({
          roleShowData: sData,
          roleSelect: rDate
        });
      } else {
        Taro.showToast({
          title: "角色最多为5个",
          duration: 5000,
          icon: "none"
        });
      }
    } else {
      let rDate = this.state.roleSelect.map(i => {
        return i;
      });
      let sData = this.state.roleShowData.map((i, index2) => {
        if (index2 === roleIndex) {
          i.isSel = false;
        }
        return i;
      });
      rDate.splice(index, 1);
      this.sortRole(rDate);
      this.setState({
        roleShowData: sData,
        roleSelect: rDate
      });
    }
  };
  onSerachChange(val: any) {
    this.setState({
      searchKey: val.detail.value
    });
  }
  onActionClick() {
    this.listSearchHandle(this.state.searchKey, this.state.roleType);
  }
  render() {
    // const imgBaseUrl =
    //   process.env.NODE_ENV === "development"
    //     ? "http://192.168.50.142:8001"
    //     : "";
    const imgBaseUrl = "";
    const submitBtn = (() => {
      return (
        <View className='bottom-bar'>
          <AtButton
            type='primary'
            size='small'
            onClick={() => {
              this.toIndex();
            }}
          >
            确定
          </AtButton>
        </View>
      );
    })();
    const selRoleItem = (() => {
      /* 吸顶 */
      return (
        <View className='select-container'>
          <View className='search-bar-container'>
            <Input
              type='text'
              placeholder='请输入需要查找的角色名或别名'
              value={this.state.searchKey}
              className='search-bar'
              onInput={e => {
                this.onSerachChange(e);
              }}
            />
            <AtButton
              type='primary'
              size='small'
              className='serach-btn'
              onClick={() => {
                this.onActionClick();
              }}
            >
              确定
            </AtButton>
          </View>
          {/* <AtSearchBar
            className='search-bar'
            showActionButton
            value={this.state.searchKey}
            onChange={this.onSerachChange.bind(this)}
            onActionClick={this.onActionClick.bind(this)}
            placeholder='请输入需要查找的角色名或别名'
          /> */}
          <Text className='select-title'>查询</Text>
          <View className='select-item'>
            {this.state.roleSelect.map(i => {
              return (
                <Image
                  key={i.roleImgId}
                  src={i.imgCloudUrl}
                  className='item-img'
                  mode='aspectFill'
                  onClick={() => {
                    this.roleSelectItemClick(i.unitId);
                  }}
                />
              );
            })}
          </View>
          {submitBtn}
        </View>
      );
    })();
    const tableItem = (() => {
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
        isShow: any;
        imgCloudUrl:string;
        id: any;
        unitId:number;
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
              onClick={() => {
                this.roleSelectHandle(i.unitId);
              }}
              mode='aspectFill'
            />
            <Text className='item-text'>{i.roleName}</Text>
          </View>
        );
      };
      return (
        <View className='role-table-content'>
          <Text className='role-table-title'>前卫</Text>
          {this.state.roleShowData.map(i => {
            return i.roleType === 1 && imgItem(i);
          })}
          <Text className='role-table-title'>中卫</Text>
          {this.state.roleShowData.map(i => {
            return i.roleType === 2 && imgItem(i);
          })}
          <Text className='role-table-title'>后卫</Text>
          {this.state.roleShowData.map(i => {
            return i.roleType === 3 && imgItem(i);
          })}
        </View>
      );
    })();
 

    return (
      <View>
        {/* {searchBar} */}
        {selRoleItem}
        {tableItem}
        <AtToast
          isOpened={this.state.toastOpen}
          text={this.state.toastText}
          status='error'
        ></AtToast>
      </View>
    );
  }
}

export default RoleTable;

/* <View className="role-table-btn">
          <AtTag
            type="primary"
            size="normal"
            className="btn"
            active={this.state.roleType.includes(1)}
            onClick={() => {
              this.changeRoleType(1);
            }}
          >
            前卫
          </AtTag>
          <AtTag
            type="primary"
            size="normal"
            className="btn"
            active={this.state.roleType.includes(2)}
            onClick={() => {
              this.changeRoleType(2);
            }}
          >
            中卫
          </AtTag>
          <AtTag
            type="primary"
            size="normal"
            className="btn"
            active={this.state.roleType.includes(3)}
            onClick={() => {
              this.changeRoleType(3);
            }}
          >
            后卫
          </AtTag>
        </View> */
