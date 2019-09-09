
import micro from 'micro'
import { getEnv } from "~utils/env";

let AUTH_PUBLIC_PEM = JSON.stringify(getEnv('AUTH_PUBLIC_PEM'))

export default micro((req, res) => {
  res.end(`define([],${AUTH_PUBLIC_PEM})`)
})
