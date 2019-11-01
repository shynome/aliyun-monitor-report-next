import { JSEncrypt } from "jsencrypt";
import { requirejs } from "~libs/web-utils/require";

export const encrypt = (secret: string, pulic_pem: string): string => {
  const sign = new JSEncrypt({})
  sign.setPublicKey(pulic_pem)
  let encrypted = sign.encrypt(secret)
  if (typeof encrypted === 'boolean') {
    throw new Error('encrypt fail')
  }
  return encrypted
}

let AUTH_PUBLIC_PEM: Promise<string>

const getAUTH_PUBLIC_PEM = (): Promise<string> => {
  return AUTH_PUBLIC_PEM || (AUTH_PUBLIC_PEM = fetch('/api/login/AUTH_PUBLIC_PEM').then(r => r.text()))
}

export const encryptToken = async (key: string, secret: string) => {
  let auth_public_pem = await getAUTH_PUBLIC_PEM()
  return encrypt([key, secret].join(','), auth_public_pem)
}

import { AuthTokenUniqueName } from "~libs/aliyun/constants";
import api from "../api/client";

export const checkToken = async (token: string) => {
  await api.get('/group/list', {
    headers: {
      [AuthTokenUniqueName]: token
    }
  })
  return
}
