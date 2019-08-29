import { GetMetricReport } from "../metric_report";
import { GetGroupList } from "../group";
import { aliyun } from "./aliyun";

describe('Aliyun', () => {

  let groupId: number
  beforeAll(async () => {
    let groups = await GetGroupList(aliyun)({})
    groupId = groups[0].GroupId
  })
  it('GetMetricReport', async () => {
    let report = await GetMetricReport(aliyun)({
      GroupId: groupId,
      StartTime: '2019-07-21 00:00:00',
      EndTime: '2019-08-01 00:00:00',
    })
    expect(report).toBeDefined()
  }, 24 * 60 * 60 * 1e3)
})
