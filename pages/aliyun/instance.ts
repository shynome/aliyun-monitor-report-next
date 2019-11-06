import { useState, useEffect } from "react";
import { createContainer } from "unstated-next";
import { LocalAccountStore, LocalAccount } from "./account";
import { AliyunClient } from "./client";

export const useAliyunInstance = () => {
  const [aliyun, setAliyunInstance] = useState<AliyunClient>(null)
  return {
    aliyun,
    setAliyunInstance,
  }
}

export const AliyunInstanceContainer = createContainer(useAliyunInstance)

import { useRouter, NextRouter } from "next/router";
import { useSnackbar } from "notistack";
import qs from "querystring";

export interface AliyunInstanceSetStatus {
  pending: boolean
}

export const GenGotoReport = (router: NextRouter) => (account: LocalAccount) => {
  router.push('/aliyun/report?' + qs.stringify({
    id: account.accessKey
  }))
}

export const useAliyunInstanceSet = () => {

  const router = useRouter()
  const { setAliyunInstance } = AliyunInstanceContainer.useContainer()
  const [status, setStatus] = useState<AliyunInstanceSetStatus>({
    pending: true,
  })
  const { enqueueSnackbar } = useSnackbar()

  const gotoLogin = () => {
    setStatus({ pending: false })
    router.push('/aliyun/account')
  }
  const gotoReport = GenGotoReport(router)

  useEffect(() => {
    let id = router.query.id as string
    if (typeof id !== 'string') {
      gotoLogin()
      return
    }
    let account = LocalAccountStore.getAccount(id)
    if (!account) {
      gotoLogin()
      return
    }
    const aliyun = new AliyunClient(account)
    aliyun.GetGroupList({}).then(
      () => {
        setStatus({ pending: false })
        setAliyunInstance(aliyun)
        gotoReport(account)
      },
      (err) => {
        gotoLogin()
        enqueueSnackbar('token 登录失败, 请重新添加该帐号', { autoHideDuration: 2e3 })
      }
    )
  }, [])

  return status
}