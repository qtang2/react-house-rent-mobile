import axios from 'axios'
import { getToken, removeToken } from '.'
import { BASE_URL } from './url'

const API = axios.create({
  baseURL: BASE_URL,
})

// add interceptors for API instance
API.interceptors.request.use((config) => {
  const { url } = config

  if (
    url.startsWith('/user') &&
    !url.startsWith('/user/login') &&
    !url.startsWith('/user/registered')
  ) {
    config.headers.Authorization = getToken()
  }

  return config
})

// add interceptors for API instance
API.interceptors.response.use((response) => {
  const { status } = response.data
  if (status === 400) {
    removeToken()
  }
  return response
})
export { API }
