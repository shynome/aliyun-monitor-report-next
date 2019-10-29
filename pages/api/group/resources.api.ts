import { PageConfig, NextApiRequest, NextApiResponse } from "next";
import *as Aliyun from "~libs/aliyun";
import micro, { createError } from 'micro'
import httpStatus from 'http-status'

export const config: PageConfig = { api: { bodyParser: { sizeLimit: '2mb' } } }

export default micro(async (req: NextApiRequest, res: NextApiResponse) => {
  const aliyun = await Aliyun.NewWithReq(req)
  let params = req.body
  let result = await aliyun.GetGroupResources(params)
  res.json(result)
})
