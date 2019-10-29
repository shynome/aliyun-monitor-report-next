
import { requirejs } from "./require"

export const DimensionsModelUrlStoreKey = 'dimensions-model-url'

export const DefaultDimensionsModelUrl = '/static/default-collect-dimensions.js'

export const setDimensionsModelUrl = (url: string) => localStorage.setItem(DimensionsModelUrlStoreKey, url)

export const GetDimensionsModelUrl = () => localStorage.getItem(DimensionsModelUrlStoreKey) || DefaultDimensionsModelUrl

import { NeedCollectDimension } from "~modules/aliyun/metric_report";
export interface CollectDimension {
  DisplayName?: string
  Name: string
  Dimensions: NeedCollectDimension[]
  Transform: (val: number) => string
}

export type CollectDimensions = CollectDimension[]

export const GetCollectDimensions = async (dimensionsModelUrl = GetDimensionsModelUrl()) => {

  let collectDimensions: CollectDimensions = await new Promise((rl, rj) => {
    requirejs([dimensionsModelUrl], (collectDimensions: any) => rl(collectDimensions), () => rj())
  })

  return collectDimensions

}

