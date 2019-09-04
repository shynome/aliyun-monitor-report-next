import { PageConfig, NextApiRequest, NextApiResponse } from "next";
import micro from "micro";
import *as Aliyun from "~lib/aliyun";
export const config: PageConfig = { api: { bodyParser: { sizeLimit: '10k' } } }

export default micro(async (req: NextApiRequest, res: NextApiResponse) => {
  const aliyun = await Aliyun.NewWithReq(req)
  let params = req.body
  let result = await aliyun.GetGroupList(params)
  res.json(result)
})
