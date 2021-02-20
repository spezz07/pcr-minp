/* eslint-disable import/prefer-default-export */
import request from "./http";

export const getRoleList = data => {
  return request.post("/role/getList", data);
};

export const getFightList = data => {
  return request.post("/fight/getList", data);
};
export const clickLike = data => {
  return request.post("/fight/like", data);
};
export const battleAdd = data =>{
  return request.post("/fight/add",data)
}
export const login = data => {
  return request.post("/user/wxlogin", data);
};



