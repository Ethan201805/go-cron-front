import request from '@/utils/request'

// 查询cron列表
export function listCron(query) {
  return request({
    url: '/job/list',
    method: 'get',
    params: query
  })
}
// 新增cron
export function insertCron(data) {
  console.log(data)
  return request({
    url: '/job',
    method: 'post',
    data
  })
}
// 更新cron
export function updateCron(data) {
  return request({
    url: '/job',
    method: 'post',
    data
  })
}
// 删除cron
export function deleteCron(name) {
  return request({
    url: '/job/'+name,
    method: 'delete',
  })
}
// 强杀cron
export function killCron(name) {
  return request({
    url: '/jobKill/'+name,
    method: 'delete',
  })
}
