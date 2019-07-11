import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}


// export function getLists(params) {
//   return request({
//     url: 'http://192.168.23.19:99/api/project/findlist',
//     method: 'get',
//     params
//   })
// }