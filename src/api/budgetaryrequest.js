// import request from '@/utils/request'
import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.23.19:99/api/';
const Qs = require('qs');
//获取预算申请项目列表
export function findList(params) {
  return axios({
    method: "get",
    url: "project/findlist",
    data:Qs.stringify(params)
  })
}