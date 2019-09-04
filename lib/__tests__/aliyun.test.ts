import { decryptAuthToken } from "../aliyun";

describe('aliyun', () => {
  it('decryptAuthToken', async () => {
    let key1 = 'fwfwqf'
    let secret1 = 'wrewqrewqr'
    let encryptedStr = 'GuLZfjWPeINifP0oYCQB16X0RQI/5M2c463xhGNLl1hSA5auAmAm8KaRL8MlhKUSKgS+F9G2oFsfHysHmyHEWuHHMu9YiggK1cO/jakqSVj4D/arHQXbdS9hfc1Flena4TwlmH+jPhqbch3ZPpokOT4sxlSnto0YllR4gempe/Y='
    let [key2, secret2] = (await decryptAuthToken(encryptedStr)).split(',')
    expect(key1).toBe(key2)
    expect(secret1).toBe(secret2)
  })
})
