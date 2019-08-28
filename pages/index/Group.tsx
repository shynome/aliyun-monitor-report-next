import React, { useState, useEffect } from 'react'
import { Select, MenuItem, Button } from "@material-ui/core";
import { Report } from "./Report";
import update from "immutability-helper";
import { Category, api } from "~pages/api/client";

type Item = {
  GroupId: number
  Type: string
  GroupName: string
}

import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns'
import *as locale from 'date-fns/locale'
type TimePickerState = {
  StartTime: string
  EndTime: string
}
type TimePickerProps = TimePickerState & {
  onChange?: (state: TimePickerState) => void
}

const timeUtils = new DateFnsUtils({ locale: locale.zhCN })
const timeLayout = "yyyy-MM-dd HH:mm:ss"
class _Utils { constructor() { return timeUtils } }

export const TimePicker: React.StatelessComponent<TimePickerProps> = (props) => {

  const [time, _setTime] = useState<TimePickerState>({ StartTime: props.StartTime, EndTime: props.EndTime })
  const onChange = typeof props.onChange === 'function' ? props.onChange : () => void 0
  const setTime = (v: TimePickerState) => {
    _setTime(v)
    onChange(v)
  }

  return (
    <MuiPickersUtilsProvider utils={_Utils}>
      <DateTimePicker label="起始时间" variant="inline" format={timeLayout} ampm={false}
        onChange={(value) => {
          let v = timeUtils.format(value as Date, timeLayout)
          setTime(update(time, { StartTime: { $set: v } }))
        }}
        value={time.StartTime}
      />
      <DateTimePicker label="结束时间" variant="inline" format={timeLayout} ampm={false}
        onChange={(value) => {
          let v = timeUtils.format(value as Date, timeLayout)
          setTime(update(time, { EndTime: { $set: v } }))
        }}
        value={time.EndTime}
      />
    </MuiPickersUtilsProvider>
  )
}

export const Group: React.StatelessComponent = () => {

  const [timeDuration, setTimeDuration] = useState<TimePickerState>({ StartTime: "2019-07-21 00:00:00", EndTime: "2019-08-01 00:00:00" })
  const [tmpTimeDuration, setTmpTimeDuration] = useState<TimePickerState>({ StartTime: "", EndTime: "" })

  const [groupId, setGroupId] = useState(0)
  const [namespaces, setNamespaces] = useState(Object.keys(Category))
  const [group, setGroup] = useState<Item[]>([])
  useEffect(() => {
    void async function () {
      let res = await api.get<Item[]>('/group/list')
      setGroup(res.data)
      setGroupId(res.data[0].GroupId)
    }()
  }, [])

  return (
    <div>
      <Select
        value={groupId}
        onChange={(e) => setGroupId(e.target.value as any)}
      >
        {group.map((item) => <MenuItem key={item.GroupId} value={item.GroupId}>{item.GroupName}</MenuItem>)}
      </Select>
      <Select multiple
        onChange={e => {
          setNamespaces(e.target.value as any)
        }}
        value={namespaces}
      >
        {Object.keys(Category).map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
      </Select>
      <Button onClick={() => setNamespaces(Object.keys(Category))}>全选</Button>
      <Button onClick={() => setNamespaces([])}>全不选</Button>
      <br />
      <TimePicker StartTime={timeDuration.StartTime} EndTime={timeDuration.EndTime} onChange={v => setTmpTimeDuration(v)} />
      <Button onClick={() => setTimeDuration(tmpTimeDuration)}>更新时间段</Button>
      <br />
      {!groupId ? null : <Report Namespaces={namespaces} GroupID={groupId} StartTime={timeDuration.StartTime} EndTime={timeDuration.EndTime} />}
    </div>
  )
}
