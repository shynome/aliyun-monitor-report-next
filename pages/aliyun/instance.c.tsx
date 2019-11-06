import React, { Fragment, useEffect } from "react";

import { AliyunInstanceContainer, useAliyunInstanceSet } from "./instance";
import { LinearProgress } from "@material-ui/core";
import { useRouter } from "next/router";

export const AliyunInstanceCheck: React.StatelessComponent = (props) => {

  const { aliyun } = AliyunInstanceContainer.useContainer()
  const router = useRouter()
  const pending = useAliyunInstanceSet()

  useEffect(() => {
    if (aliyun) {
      return
    }
    router.push('/aliyun/account')
  }, [pending])

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
