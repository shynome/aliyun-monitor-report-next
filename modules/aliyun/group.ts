
import { Aliyun, CommonParams } from "./aliyun";

// GetGroupListParams type
export interface GetGroupListParams extends CommonParams {
  Keyword?: string
}

export interface Group {
  GroupId: number
  GroupName: string
  Type: string
}

export const GetGroupList = (aliyun: Aliyun) => async (params: GetGroupListParams) => {
  let client = aliyun.GetClient()
  let result: { Resources: { Resource: Group[] } } = await client.request(
    'DescribeMonitorGroups',
    {
      PageSize: '99',
      ...params,
    },
  )
  let resources = result.Resources.Resource.map<Group>(
    ({ GroupId, GroupName, Type }) => ({ GroupId, GroupName, Type })
  )
  return resources
}

export interface GetGroupResourcesParams extends CommonParams {
  GroupId: number
  Category?: string
  Keyword?: string
}

export interface GroupResource {
  /**产品名称缩写 */
  Category: string
  /**资源ID */
  Id: number
  /**实例ID，实例的唯一标识 */
  InstanceId: string
  /**实例名称 */
  InstanceName: string
  RegionId: string
}

export const GetGroupResources = (aliyun: Aliyun) => async (params: GetGroupResourcesParams): Promise<GroupResource[]> => {

  const client = aliyun.GetClient()

  let result: { Resources: { Resource: GroupResource[] } } = await client.request(
    'DescribeMonitorGroupInstances',
    {
      PageSize: '99',
      ...params,
    },
  )

  let resources = result.Resources.Resource.map<GroupResource>(
    ({ Category, Id, InstanceId, InstanceName, RegionId }) => ({ Category, Id, InstanceId, InstanceName, RegionId })
  )

  return resources
}
