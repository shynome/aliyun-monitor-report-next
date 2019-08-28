
import { Aliyun } from "../aliyun";
import { Dimension } from "../dimension";

export const aliyun = Aliyun.NewWithEnv()

import { GetGroupList, GetGroupResources } from "../group";

export const getECSDimensions = async () => {
  let groups = await GetGroupList(aliyun)({})
  let resources = await GetGroupResources(aliyun)({ GroupId: groups[0].GroupId })

  let dimensions: Dimension[] = resources
    .filter(v => v.Category === 'ECS')
    .map<Dimension>(
      ({ InstanceId }) => ({ instanceId: InstanceId })
    )

  return JSON.stringify(dimensions)
}
