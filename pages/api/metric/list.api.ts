import { PageConfig, NextApiRequest, NextApiResponse } from "next";
import micro, { createError } from "micro";
import httpStatus from "http-status";
import { aliyun } from "~lib/aliyun";
export const config: PageConfig = { api: { bodyParser: { sizeLimit: '1mb' } } }

export default micro(async (req: NextApiRequest, res: NextApiResponse) => {
  
  let params = req.body
  let result = await aliyun.GetMetricList(params)
  res.json(result)

})
