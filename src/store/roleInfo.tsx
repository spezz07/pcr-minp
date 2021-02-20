import { observable, action, runInAction, computed, autorun } from "mobx";


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

 type userInfo = {
  userId: string;
  userName: string;
  openId: string;
};
export type RoleStoreType = {
  roleData: roleProps[];
  roleSelectData: roleProps[];
  userInfo: userInfo;
  addRoleData(v: any);
  changeRoleSelectData(v: any);
};
class RoleStore {
  constructor() {
    autorun(() => console.log("--roleaction--"));
  }
  @observable
  roleData: Array<roleProps> = [];
  @observable
  roleSelectData: Array<roleProps> = [];
  @observable
  userInfo: userInfo = {
    userId: "",
    userName: "",
    openId: ""
  };
  @action.bound
  addRoleData(v) {
    this.roleData = v;
  }
  @action.bound
  changeRoleSelectData(v) {
    this.roleSelectData = []
    this.roleSelectData = v;
  }
  @computed get rsStoreData() {
    return this.roleSelectData;
  }
}

// decorate(RoleStore, {
//   roleSelectData: observable,
//   userInfo: observable,
//   roleData: observable,
//   addRoleData: action.bound,
//   changeRoleSelectData:action.bound
// });

export default RoleStore;