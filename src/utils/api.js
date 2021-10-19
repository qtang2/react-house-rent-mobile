import axios from 'axios'
import { BASE_URL } from './url'

export const API = axios.create({
  baseURL: BASE_URL,
})
