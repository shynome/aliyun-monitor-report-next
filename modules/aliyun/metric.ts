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

export const GetMetricList = (aliyun: Aliyun) => async (params: GetMetricListParams) => {

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


