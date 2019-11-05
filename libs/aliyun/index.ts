
import { Aliyun } from "~modules/aliyun";
import { AuthTokenUniqueName } from "~libs/aliyun/constants";
import { NextApiRequest } from "next";
import { createError } from "micro";
import httpStatus from "http-status";
import crypto from 'crypto'
import { getEnv } from "~libs/server-utils/env";

export const decrypt = (private_pem: string) => async (encrypted_secret: string) => {
  let buf = crypto.privateDecrypt(
    {
      key: private_pem,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(encrypted_secret, 'base64')
  )
  return buf.toString()
}
export const decryptAuthToken = decrypt(getEnv('AUTH_PRIVATE_PEM'))

export const NewWithReq = async (req: NextApiRequest) => {
  let token = req.headers[AuthTokenUniqueName]
  if (typeof token !== 'string' || token.length === 0) {
    throw createError(httpStatus.UNAUTHORIZED, 'need cookie token for auth')
  }
  let decryptStr = await decryptAuthToken(token).catch(err => {
    throw createError(httpStatus.BAD_REQUEST, `can't parse token, maybe client public pem and server pem maybe not a pair `)
  })
  let [AccessKey, AccessKeySecret] = decryptStr.split(',')
  if (typeof AccessKeySecret !== 'string' || typeof AccessKey !== 'string') {
    throw createError(httpStatus.BAD_REQUEST, 'the encrypt format is wrong, should be `${AccessKey},${AccessKeySecret}`')
  }
  return new Aliyun(AccessKey, AccessKeySecret)
}
