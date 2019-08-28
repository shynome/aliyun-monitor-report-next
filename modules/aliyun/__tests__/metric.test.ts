
import { GetMetricList } from "../metric";
import { aliyun, getECSDimensions } from "./aliyun";


describe('Aliyun', () => {

  let dimensions: string
  beforeAll(async () => {
    dimensions = await getECSDimensions()
  })

  it('GetMetricList', async () => {
    let datapoints = await GetMetricList(aliyun)({
      Dimensions: dimensions,
      Namespace: 'acs_ecs',
      MetricName: 'CPUUtilization',
    })
    expect(datapoints.length).toBeGreaterThanOrEqual(1)
  })
  
})
