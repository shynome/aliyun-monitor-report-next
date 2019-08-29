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
  OrderDesc?: 'False'
  Length?: '1'
}

export const GetMetricTop = (aliyun: Aliyun) => async (params: GetMetricTopParams): Promise<Datapoint[]> => {

  let orderBy = params.Orderby || 'Maximum'

  params = {
    Express: `{"orderby":"${orderBy}"}`,
    Length: '1',
    ...params,
  }

  let client = aliyun.GetClient()

  let result: { Datapoints: string } = await client.request(
    'DescribeMetricList',
    params,
    { method: 'POST' }
  )

  let filters = new Map<string, number>()
  let datapoints: Datapoint[] = JSON.parse(result.Datapoints)

  return datapoints
}


export const notWorkGetMetricTop = (aliyun: Aliyun) => async (params: GetMetricTopParams): Promise<Datapoint[]> => {

  params = {
    Orderby: params.Orderby || 'Maximum',
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

  return datapoints
}
