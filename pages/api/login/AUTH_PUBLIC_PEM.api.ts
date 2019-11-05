
import micro from 'micro'
import *as BrowserEncrypt from "~libs/config/browser-encrypt";

export default micro((req, res) => {
  res.end(BrowserEncrypt.AUTH_PUBLIC_PEM)
})
