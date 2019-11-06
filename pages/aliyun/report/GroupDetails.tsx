import React, { useState, useEffect } from 'react'
import { Select, MenuItem, CircularProgress } from "@material-ui/core";
import { api } from "~pages/api/client";

export type Props = {
  GroupId: number
  Category?: string
}

type Item = {
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


const useData = (props:Props): null | Item[] => {
  let [data, setData] = useState<Item[]>([])
  useEffect(() => {
    void async function () {
      let res = await api.post<Item[]>('/group/resources', props)
      if( res === null ){
        setData([])
        return
      }
      setData(res.data)
    }()
  }, [JSON.stringify(props)])
  return data.length ? data : null
}

export const GroupDetails: React.StatelessComponent<Props> = (props) => {

  let data = useData(props)
  let [ value, setValue ] = useState(0)
  useEffect(()=>{
    if(data && data[0].Id){
      setValue(data[0].Id)
    }
  },[data && data[0].Id])

  if (data === null) {
    return <CircularProgress />
  }

  return (
    <>
      <Select
        value={value}
        onChange={e=>setValue(e.target.value as any)}
        >
        {data.map((item)=>(<MenuItem key={item.Id} value={item.Id}>{props.Category ? '' : item.Category} {item.InstanceName || item.InstanceId}</MenuItem>))}
      </Select>
    </>
  )
}
