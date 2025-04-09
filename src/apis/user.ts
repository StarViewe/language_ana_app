import request from '@/utils/request'

export const getCaptcha = () => {
  return request({
    method: 'GET',
    url: '/captcha',
  })
}

export const login = (data: LoginData) => {
  return request({
    method: 'GET',
    url: '/login',
    params: data,
    withCredentials: true,
  })
}

export const register = (data: RegisterData) => {
  return request({
    method: 'POST',
    url: '/register',
    data,
  })
}

export const GetUserInfo = () => {
  const token = localStorage.getItem('TokenInfo')
  return request({
    method: 'GET',
    url: '/ydznz/user',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  })
}

export const UpdateUserInfo = (data) => {
  const token = localStorage.getItem('TokenInfo')
  return request({
    method: 'POST',
    url: '/ydznz/update',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    data,
  })
}

export const AdminSearchUser = (data) => {
  const token = localStorage.getItem('TokenInfo')
  return request({
    method: 'GET',
    url: '/ydznz/admin/user/search',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    params: data,
  })
}

export const AdminDeleteUser = (data) => {
  const token = localStorage.getItem('TokenInfo')
  return request({
    method: 'DELETE',
    url: '/ydznz/admin/user/delete',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    params: data,
  })
}

export const AdminUpdateUser = (data) => {
  const token = localStorage.getItem('TokenInfo')
  return request({
    method: 'POST',
    url: '/ydznz/admin/user/update',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    params: data,
  })
}

export const AdminWriteUser = (data) => {
  const token = localStorage.getItem('TokenInfo')
  return request({
    method: 'POST',
    url: '/ydznz/admin/user/write',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    data,
  })
}
