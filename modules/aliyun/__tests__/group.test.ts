
import { GetGroupList } from "../group";
import { aliyun } from "./aliyun";
import httpx from 'httpx';

describe('Aliyun', () => {
  it('GetGroupList', async () => {
    let keywords = 'nnnnn'
    let groupList = await GetGroupList(aliyun)({ Keyword: keywords, RegionID: "cn-hangzhou" })
    expect(groupList).toHaveLength(0)
  })
})
