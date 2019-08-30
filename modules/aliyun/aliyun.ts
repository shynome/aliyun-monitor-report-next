
import Core from "@alicloud/pop-core";
import {
  GetGroupList, GetGroupListParams,
  GetGroupResources, GetGroupResourcesParams,
} from "./group";
import {
  GetMetricList, GetMetricListParams,
  GetMetricTop, GetMetricTopParams,
} from "./metric";
import { GetMetricReport, GetMetricReportParams } from "./metric_report";

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

  GetGroupList = (params: GetGroupListParams) => GetGroupList(this)(params)
  GetGroupResources = (params: GetGroupResourcesParams) => GetGroupResources(this)(params)
  GetMetricList = (params: GetMetricListParams) => GetMetricList(this)(params)
  GetMetricTop = (params: GetMetricTopParams) => GetMetricTop(this)(params)
  GetMetricReport = (params: GetMetricReportParams) => GetMetricReport(this)(params)

  static required_env = ['AccessKey', 'AccessKeySecret']
  static NewWithEnv() {
    let [key, secret] = this.required_env.map(k => process.env[k])
    if (!key || !secret) {
      throw new Error('required_env: ' + this.required_env.join(','))
    }
    return new Aliyun(key, secret)
  }
}
