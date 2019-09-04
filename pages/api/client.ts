import axios from "axios";

export enum Category {
  ECS = 'ECS',
  RDS = 'RDS',
  SLB = 'SLB',
  CDN = 'CDN',
  KVSTORE = 'KVSTORE',
}

export const api = axios.create({
  baseURL: '/api'
})

import { AuthTokenUniqueName } from "~lib/constants";
api.interceptors.request.use((config) => {
  let token = localStorage.getItem(AuthTokenUniqueName)
  if (token) {
    config.headers[AuthTokenUniqueName] = token
  }
  return config
})

export default api
