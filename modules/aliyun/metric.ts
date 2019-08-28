import { Aliyun, CommonParams } from "./aliyun";

export interface Datapoint {
  Timestamp: number
  instanceId: string
  Minimum: number
  Average: number
  Maximum: number
  // Order      int
  // userId     string `json:"userId"`
  // _count      int `json:"_count"`
}

export interface GetMetricListParams extends CommonParams {
  Dimensions: string
  MetricName: string
  Namespace: string
  Period?: string
  StartTime?: string
  EndTime?: string
  Express?: string
  Length?: string
}

export const GetMetricList = (aliyun: Aliyun) => async (params: GetMetricListParams): Promise<Datapoint[]> => {

  let client = aliyun.GetClient()

  let result: { Datapoints: string } = await client.request(
    'DescribeMetricList',
    {
      ...params
    },
    { method: 'POST' }
  )

  let datapoints: Datapoint[] = JSON.parse(result.Datapoints)

  return datapoints

}

// GetMetricTopParams type
export interface GetMetricTopParams extends GetMetricListParams {
  Orderby?: 'Maximum' | 'Average'
}

export const GetMetricTop = (aliyun: Aliyun) => async (params: GetMetricTopParams): Promise<Datapoint[]> => {

  params = {
    Orderby: 'Maximum',
    ...params,
  }

  let client = aliyun.GetClient()

  let result: { Datapoints: string } = await client.request(
    'DescribeMetricTop',
    params,
    { method: 'POST' }
  )

  let filters = new Map<string, number>()
  let datapoints: Datapoint[] = JSON.parse(result.Datapoints)

  // datapoints = datapoints.filter(
  //   (d) => {
  //     let latest_value = filters.get(d.instanceId)
  //     let current_value = d[params.Orderby]
  //     if (typeof latest_value !== 'undefined' && latest_value > current_value) {
  //       return false
  //     }
  //     filters.set(d.instanceId, current_value)
  //     return true
  //   }
  // )

  return datapoints
}
