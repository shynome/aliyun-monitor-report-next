
import { Aliyun, CommonParams } from "./aliyun";

// GetGroupListParams type
interface GetGroupListParams extends CommonParams {
  Keyword?: string
}

interface Group {
  GroupID: number
  GroupName: string
  Type: string
}

export const GetGroupList = (aliyun: Aliyun) => async (params: GetGroupListParams) => {
  let client = aliyun.GetClient(params.RegionID)
  let result: { Resources: { Resource: Group[] } } = await client.request(
    'DescribeMonitorGroups',
    {
      PageSize: '99',
      ...params,
    },
    { method: 'POST' }
  )
  let resources = result.Resources.Resource.map<Group>(
    ({ GroupID, GroupName, Type }) => ({ GroupID, GroupName, Type })
  )
  return resources
}
