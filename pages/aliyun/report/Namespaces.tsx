import React, { useState } from 'react'
import { Select, MenuItem } from '@material-ui/core'

export const supportProducts = [
  { "Namespace": "acs_cdn", "Description": "CDN" },
  { "Namespace": "acs_slb_dashboard", "Description": "负载均衡" },
  { "Namespace": "acs_rds_dashboard", "Description": "云数据库RDS版" },
  { "Namespace": "acs_kvstore", "Description": "云数据库Redis版" },
  { "Namespace": "acs_ecs_dashboard", "Description": "云服务器ECS" },
]

type Item = {Namespace:string,Description:string}

export const Namespaces:React.StatelessComponent = ()=>{

  const [ ] = useState<Item[]>([])
  // useEffect(()=>{
  //   void async function(){
  //     let res = await api.get<Item[]>('/monitor/namespaces')
  //     let data = res.data
  //     data = data.filter(v=>v.Namespace !== "")
  //     data.sort(v=>supportProducts.indexOf(v.Namespace) === -1 ? 1 : -1)
  //     setData(data)
  //   }()
  // },[])
  
  // const [ selectedValue, setSelectedValue ] = useState<Item[]>([...supportProducts])
  const [ value, setValue ] = useState<string>("acs_cdn")
  
  return (
    <>
      <Select
        value={value}
        onChange={(e)=>setValue(e.target.value as string)}
        style={{width:200}}
        >
        {supportProducts.map((item)=>(<MenuItem value={item.Namespace} key={item.Namespace}>{item.Description}</MenuItem>))}
      </Select>
      {/* <Select
        multiple
        value={selectedValue}
        onChange={e=>setSelectedValue(e.target.value as any)}
        style={{width:500}}
        >
        {data.map((item)=>(<MenuItem key={item.Namespace} disabled={supportProducts.indexOf(item.Namespace)<0} value={item.Namespace}>{item.Description}</MenuItem>))}
      </Select> */}
    </>
  )
}

