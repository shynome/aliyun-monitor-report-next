
import micro from 'micro'
import { getEnv } from "~libs/server-utils/env";

let AUTH_PUBLIC_PEM = getEnv('AUTH_PUBLIC_PEM')

export default micro((req, res) => {
  res.end(AUTH_PUBLIC_PEM)
})
