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
export default api
