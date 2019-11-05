import {
  makeStyles,
  TextField, Button, useTheme,
  CircularProgress,
} from "@material-ui/core";
import { useFormFields } from "~libs/web-utils/form";
import { localAccountStoreContainer } from "./useLocalAccountStore";
import { TabSelectStatusContainer, AccountPanelType } from "./TabSelectStatus";
import { useSnackbar } from "notistack";
import qs from "querystring";

export const useStyles = makeStyles(theme => ({
  input: {
    marginBottom: '10px',
  },
  submit: {
    margin: '10px 0 0',
  },
}))

import { checkToken, encryptToken } from "../auth";
import React, { useState } from "react";

interface PostStatus {
  pending: boolean,
  error: Error,
  data: any,
}

export const AccountAdd: React.StatelessComponent = () => {

  const styles = useStyles(useTheme())
  const { enqueueSnackbar } = useSnackbar()
  const { accountManager } = localAccountStoreContainer.useContainer()
  const { setSelectedTab } = TabSelectStatusContainer.useContainer()
  const [postStatus, setPostStatus] = useState<PostStatus>({ pending: false, error: null as any, data: null as any })

  const [form, saveFormField] = useFormFields({
    uniqueName: '',
    AccessKey: '',
    AccessKeySecret: '',
  })

  const _handleSubmit = async () => {
    let token = await encryptToken(form.AccessKey, form.AccessKeySecret)
    await checkToken(token)
    await accountManager.add({
      displayName: form.uniqueName,
      accessKey: form.AccessKey,
      token: token,
    })
    setSelectedTab(AccountPanelType.List)
    // reset
    let v = { target: { value: '' } }
    // @ts-ignore
    setUniqueName(v); setAccessKey(v); setAccessKeySecret(v)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (postStatus.pending) {
      return
    }
    setPostStatus({ pending: true, error: null as any, data: null as any })
    _handleSubmit().then(
      (userInfo) => {
        setPostStatus({ pending: false, error: null as any, data: userInfo, })
        enqueueSnackbar('添加成功', {
          autoHideDuration: 2e3,
        })
      },
      (err: Error) => {
        setPostStatus({ pending: false, error: err, data: null as any })
        enqueueSnackbar(err.message, { autoHideDuration: 2e3 })
      }
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label={'显示名'}
        className={`${styles.input}`}
        required
        onChange={saveFormField('uniqueName')}
        value={form.uniqueName}
        fullWidth
      />
      <TextField
        label={'阿里云 AccessKey'}
        className={`${styles.input}`}
        required
        onChange={saveFormField('AccessKey')}
        value={form.AccessKey}
        fullWidth
      />
      <TextField
        label={'阿里云 AccessKeySecret'}
        className={`${styles.input}`}
        required
        onChange={saveFormField('AccessKeySecret')}
        value={form.AccessKeySecret}
        fullWidth
      />
      <Button disabled={postStatus.pending} className={styles.submit} type='submit' fullWidth size='large' variant='contained' color='primary'>
        {postStatus.pending
          ? ['验证帐号中', <CircularProgress size='1rem' style={{ marginLeft: '1rem' }} />]
          : '添加新帐号'}
      </Button>
    </form>
  )
}