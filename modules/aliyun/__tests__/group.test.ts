
import { GetGroupList, GetGroupResources } from "../group";
import { aliyun } from "./aliyun";

describe('Aliyun', () => {
  it('GetGroupList', async () => {
    let keywords = 'nnnnn'
    let groupList = await GetGroupList(aliyun)({ Keyword: keywords })
    expect(groupList).toHaveLength(0)
  })
  it('GetGroupResources', async () => {
    let groups = await GetGroupList(aliyun)({})
    expect(groups).toHaveLength(1)
    let groupResources = await GetGroupResources(aliyun)({ GroupId: groups[0].GroupId })
    expect(groupResources.length).toBeGreaterThanOrEqual(1)
  })
})
