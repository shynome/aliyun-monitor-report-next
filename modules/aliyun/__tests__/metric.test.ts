
import { GetMetricList, GetMetricTop } from "../metric";
import { aliyun, getECSDimensions } from "./aliyun";
import { Dimension } from "../dimension";

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
  it('GetMetricTop', async () => {
    let d: Dimension[] = JSON.parse(dimensions)
    let datapoints = await GetMetricTop(aliyun)({
      Dimensions: dimensions,
      Namespace: 'acs_ecs',
      MetricName: 'CPUUtilization',
    })
    expect(datapoints.length).toBe(d.length)
  })
})
