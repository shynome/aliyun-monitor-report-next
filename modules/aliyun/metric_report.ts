import { Aliyun, CommonParams } from "./aliyun";
import { GroupResource, GetGroupResources } from "./group";
import { GetMetricTopParams, GetMetricTop } from "./metric";
import { Dimension as instanceDimension } from "./dimension";
import { DefaultCollectDimensions } from "./metric_report.data";

export const getNamespace = (category: string): string => {
  category = "acs_" + category.toLowerCase()
  switch (category) {
    case "acs_slb":
      category = "acs_slb_dashboard";
      break;
    case "acs_ecs":
      category = "acs_ecs_dashboard";
      break;
    case "acs_rds":
      category = "acs_rds_dashboard";
      break;
    case "acs_apigateway":
      category = "acs_apigateway_dashboard";
      break;
    case "acs_containerservice":
      category = "acs_containerservice_dashboard";
      break;
    case "acs_ehpc":
      category = "acs_ehpc_dashboard";
      break;
    case "acs_ess":
      category = "acs_ess_dashboard";
      break;
    case "acs_oss":
      category = "acs_oss_dashboard";
      break;
    case "acs_sls":
      category = "acs_sls_dashboard";
      break;
  }
  return category
}

export interface GetMetricReportParams {
  StartTime: string
  EndTime: string
  /**应用分组的 ID */
  GroupId: number
}

export type MetricReport = {
  [Category: string]: Report[]
}

export type CollectDimension = {
  DisplayName: string
  Name: string
  Error: string
  Max: number
  Avg: number
}

export interface Report extends GroupResource {
  Dimensions: CollectDimension[]
}

const [OrderbyMax, OrderbyAvg] = ['Maximum', 'Average'] as GetMetricTopParams['Orderby'][]

export const GetMetricReport = (aliyun: Aliyun) => async (params: GetMetricReportParams) => {

  const client = aliyun.GetClient()
  let resources = await GetGroupResources(aliyun)({ GroupId: params.GroupId })

  let report: MetricReport = {}

  let d: { [k: string]: GroupResource[] } = {}

  for (let item of resources) {
    let namespace = getNamespace(item.Category)
    if (typeof d[namespace] === 'undefined') {
      d[namespace] = []
    }
    d[namespace].push(item)
  }

  const getReport = async (namespace: string, needCollectDimensions: CollectDimension[], resources: GroupResource[]): Promise<Report[]> => {

    let reportArray = new Map<string, Report>(
      resources.map((resource) => [
        resource.InstanceId,
        {
          ...resource,
          Dimensions: [],
        },
      ])
    )

    let instances = resources.map<instanceDimension>(
      ({ InstanceId }) => ({ instanceId: InstanceId })
    )
    let instancesStr = JSON.stringify(instances)

    const dealCollectDimension = async (collectDimension: CollectDimension): Promise<Map<string, CollectDimension>> => {

      let collectedDimensions = new Map<string, CollectDimension>(
        instances.map(
          ({ instanceId }) => [instanceId, { ...collectDimension }]
        )
      )

      let DatapointsPromisedArray = [OrderbyMax, OrderbyAvg].map(async (orderBy) => {
        let datapoints = await GetMetricTop(aliyun)({
          Namespace: namespace,
          Dimensions: instancesStr,
          MetricName: collectDimension.Name,
          StartTime: params.StartTime,
          EndTime: params.EndTime,
          Orderby: orderBy,
        })
        return datapoints
      })

      let DatapointsArray = await Promise.all(DatapointsPromisedArray)

      await [OrderbyMax, OrderbyAvg].map((orderBy, index) => {
        let datapoints = DatapointsArray[index]

        for (let datapoint of datapoints) {
          let currentValue = datapoint[orderBy]
          if (isNaN(currentValue)) {
            continue
          }
          let dimension = collectedDimensions.get(datapoint.instanceId)
          let lastestValue = dimension[orderBy] || 0
          if (currentValue > lastestValue) {
            dimension[orderBy] = currentValue
          }
        }

      });

      return collectedDimensions
    }

    const insertReportArray = async (collectDimension: CollectDimension) => {
      let collectedDimensions = await dealCollectDimension(collectDimension)
      for (let instanceId of collectedDimensions.keys()) {
        let report = reportArray.get(instanceId)
        let collectedDimension = collectedDimensions.get(instanceId)
        report.Dimensions.push(collectedDimension)
      }
    }

    // for (let collectDimension of needCollectDimensions) {
    //   await insertReportArray(collectDimension)
    // }
    await Promise.all(needCollectDimensions.map(
      collectDimension => insertReportArray(collectDimension)
    ))

    return Array.from(reportArray.values())

  }

  for (let namespace in d) {
    report[namespace] = await getReport(namespace, DefaultCollectDimensions[namespace], d[namespace])
  }
  // 这样会触发流量控制
  // await Promise.all(
  //   Object.keys(d).map(
  //     async (namespace) => {
  //       report[namespace] = await getReport(namespace, DefaultCollectDimensions[namespace], d[namespace])
  //       return
  //     }
  //   )
  // )

  return report

}
