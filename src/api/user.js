import request from '../utils/request'
export const login = (data) => {
  return request({
    method: 'Post',
    url: '/v1_0/authorizations',
    data
  })
}
