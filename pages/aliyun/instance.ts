import { useState, useEffect } from "react";
import { createContainer } from "unstated-next";
import { LocalAccountStore, LocalAccount } from "./account";
import { AliyunClient } from "./client";

export interface AliyunInstanceState {
  aliyun: AliyunClient,
  pending: boolean
}

export const useAliyunInstance = () => {
  const [state, setAliyunInstance] = useState<AliyunInstanceState>({
    aliyun: null,
    pending: false
  })
  return {
    ...state,
    setAliyunInstance,
  }
}

export const AliyunInstanceContainer = createContainer(useAliyunInstance)

import { useRouter, NextRouter } from "next/router";
import { useSnackbar } from "notistack";
import qs from "querystring";

export const GenGotoReport = (router: NextRouter) => (account: LocalAccount) => {
  router.push('/aliyun/report?' + qs.stringify({
    id: account.accessKey
  }))
}

export const useAliyunInstanceSet = () => {

  const router = useRouter()
  const { pending, setAliyunInstance, aliyun } = AliyunInstanceContainer.useContainer()
  const { enqueueSnackbar } = useSnackbar()

  const setNeddLoginState = () => {
    setAliyunInstance({ pending: false, aliyun: null })
  }
  const gotoReport = GenGotoReport(router)

  useEffect(() => {

    if (aliyun) {
      return
    }

    let query = qs.parse(router.asPath.split('?')[1] || '')
    let id = query.id as string
    console.log(id)
    if (typeof id !== 'string') {
      setNeddLoginState()
      return
    }
    let account = LocalAccountStore.getAccount(id)
    if (!account) {
      setNeddLoginState()
      return
    }
    const _aliyun = new AliyunClient(account)
    _aliyun.GetGroupList({}).then(
      () => {
        setAliyunInstance({ pending: false, aliyun: _aliyun })
        gotoReport(account)
      },
      (err) => {
        setNeddLoginState()
        enqueueSnackbar('token 登录失败, 请重新添加该帐号', { autoHideDuration: 2e3 })
      }
    )
  }, [router.asPath, aliyun])

  return pending
}