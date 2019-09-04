import { PageConfig, NextApiRequest, NextApiResponse } from "next";
import micro from "micro";
import *as Aliyun from "~lib/aliyun";
export const config: PageConfig = { api: { bodyParser: { sizeLimit: '1mb' } } }

export default micro(async (req: NextApiRequest, res: NextApiResponse) => {
  const aliyun = await Aliyun.NewWithReq(req)
  let params = req.body
  let result = await aliyun.GetMetricTop(params)
  res.json(result)

})
