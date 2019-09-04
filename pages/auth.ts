import { JSEncrypt } from "jsencrypt";

export const encrypt = (secret: string, pulic_pem: string): string => {
  const sign = new JSEncrypt({})
  sign.setPublicKey(pulic_pem)
  let encrypted = sign.encrypt(secret)
  if (typeof encrypted === 'boolean') {
    throw new Error('encrypt fail')
  }
  return encrypted
}

export const encryptToken = (key: string, secret: string) => encrypt([key, secret].join(','), AUTH_PUBLIC_PEM)

import { AuthTokenUniqueName } from "~lib/constants";
import api from "./api/client";
export const setToken = (token: string) => {
  localStorage.setItem(AuthTokenUniqueName, token)
}

export const checkToken = async (token: string) => {
  await api.get('/group/list', {
    headers: {
      [AuthTokenUniqueName]: token
    }
  })
  return
}
