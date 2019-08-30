
import Core from "@alicloud/pop-core";

export interface CommonParams {
  RegionID?: string
}

export class Aliyun {
  constructor(
    readonly AccessKey: string,
    readonly AccessKeySecret: string,
  ) { }
  GetClient() {
    return new Core({
      accessKeyId: this.AccessKey,
      accessKeySecret: this.AccessKeySecret,
      endpoint: 'https://metrics.aliyuncs.com',
      apiVersion: '2019-01-01',
      opts: {
        method: 'POST',
        timeout: 60 * 1e3,
      },
    })
  }
  static required_env = ['AccessKey', 'AccessKeySecret']
  static NewWithEnv() {
    let [key, secret] = this.required_env.map(k => process.env[k])
    if (!key || !secret) {
      throw new Error('required_env: ' + this.required_env.join(','))
    }
    return new Aliyun(key, secret)
  }
}
