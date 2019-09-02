import React, { useState, useEffect } from 'react'
import { LinearProgress, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
import { api } from "~pages/api/client";
import { MetricReport } from "~modules/aliyun/metric_report";

type ReportParams = {
  GroupId: number
  StartTime: string
  EndTime: string
  Namespaces?: string[]
}

export const isEmpty = (val: any) => typeof val === 'undefined' || val === null

export const Report: React.StatelessComponent<ReportParams> = (props) => {

  let namespaces = props.Namespaces || []

  let [report, setReport] = useState<MetricReport>(null as any)
  let reqParams: ReportParams = {
    GroupId: props.GroupId,
    StartTime: props.StartTime,
    EndTime: props.EndTime,
  }
  useEffect(() => {
    void async function () {
      console.log(reqParams)
      let resp = await api.post<MetricReport>('/metric/report', reqParams)
      setReport(resp.data)
    }()
  }, [JSON.stringify(reqParams)])

  if (report === null) {
    return <LinearProgress />
  }

  return (
    <>
      {Object.keys(report).map((key) => {
        let reports = report[key]
        return (
          <div key={key}>
            <h3>{key}</h3>
            <Table>
              <TableHead>
                <TableRow>
                  {["实例名", "统计维度", "最大值(峰值)", "平均值(峰值)"].map(v => <TableCell key={v}>{v}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => {
                  let h = report.Dimensions.length
                  return report.Dimensions.sort((a, b) => a.Name > b.Name ? -1 : 1).map((d, i) => (
                    <TableRow key={report.Id + d.Name}>
                      {i === 0 && <TableCell rowSpan={h} style={{ width: 180 }}>{report.InstanceName || report.InstanceId}</TableCell>}
                      <TableCell>{d.DisplayName}</TableCell>
                      <TableCell align="right">{isEmpty(d.Maximum) ? "无值" : d.Maximum.toFixed(2)}</TableCell>
                      <TableCell align="right">{isEmpty(d.Average) ? "无值" : d.Average.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                })}
              </TableBody>
            </Table>
          </div>
        )
      })}
    </>
  )
}
