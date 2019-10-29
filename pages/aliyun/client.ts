import axios from 'axios'
import {
  GetGroupListParams,
  Group,
  GetGroupResourcesParams,
  GroupResource,
} from "~modules/aliyun/group";
import {
  GetMetricListParams,
  GetMetricTopParams,
  Datapoint,
} from '~modules/aliyun/metric';
import {
  GetMetricReportParams,
  MetricReport,
} from '~modules/aliyun/metric_report';

export class AliyunClient {
  client = axios.create({
    baseURL: '/api',
  })
  async GetGroupList(params: GetGroupListParams) {
    return this.client.post<Group[]>('/group/list', params)
  }
  async GetGroupResources(params: GetGroupResourcesParams) {
    return this.client.post<GroupResource[]>('/group/resources', params)
  }
  async GetMetricList(params: GetMetricListParams) {
    return this.client.post<Datapoint[]>('/metric/list', params)
  }
  async GetMetricTop(params: GetMetricTopParams) {
    return this.client.post<Datapoint[]>('/metric/top', params)
  }
  async GetMetricReport(params: GetMetricReportParams) {
    return this.client.post<MetricReport[]>('/metric/top', params)
  }
}
