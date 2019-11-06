import React, { Fragment } from "react";

import { AliyunInstanceContainer, useAliyunInstance, useAliyunInstanceSet } from "./instance";
import { LinearProgress, Paper } from "@material-ui/core";
import { useRouter } from "next/router";

export const AliyunInstanceCheck: React.StatelessComponent = (props) => {

  const { aliyun } = useAliyunInstance()
  const router = useRouter()
  const { pending } = useAliyunInstanceSet()

  if (pending) {
    return <LinearProgress />
  }

  if (!aliyun && !router.pathname.startsWith('/aliyun/account')) {
    return <LinearProgress />
  }

  return (
    <Fragment>
      {props.children}
    </Fragment >
  )

}
