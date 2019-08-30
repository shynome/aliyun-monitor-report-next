import { PageConfig, NextApiRequest, NextApiResponse } from "next";

export const config: PageConfig = { api: { bodyParser: { sizeLimit: '1mb' } } }

export default (req: NextApiRequest, res: NextApiResponse) => {
  debugger
  res.end()
}
