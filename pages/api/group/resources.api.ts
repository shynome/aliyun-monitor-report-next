import { PageConfig, NextApiRequest, NextApiResponse } from "next";
import { aliyun } from "~lib/aliyun";
import micro, { createError } from 'micro'
import httpStatus from 'http-status'

export const config: PageConfig = { api: { bodyParser: { sizeLimit: '2mb' } } }

export default micro(async (req: NextApiRequest, res: NextApiResponse) => {

  let params = req.body
  
  let result = await aliyun.GetGroupResources(params).catch(
    (err: Error) => {
      throw createError(httpStatus.INTERNAL_SERVER_ERROR, err.message)
    }
  )
  res.json(result)

})
