import { PageConfig, NextApiRequest, NextApiResponse } from "next";
import { aliyun } from "~lib/aliyun";

export const config: PageConfig = { api: { bodyParser: { sizeLimit: '10k' } } }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let params = req.body
  let result = await aliyun.GetGroupList(params)
  res.json(result)
}
