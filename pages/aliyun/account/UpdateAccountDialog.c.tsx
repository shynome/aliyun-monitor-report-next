
import React, { Fragment, useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField,
  useTheme,
} from "@material-ui/core";
import { LocalAccount } from "../account";

export interface OnConfirmUpdateAccount {
  (v: false): any
  (v: true, account: LocalAccount): any
}

import { useStyles } from './Add.part'

export const UpdateAccountDialog: React.StatelessComponent<{ account: LocalAccount | null, pending: boolean, onConfirm: OnConfirmUpdateAccount }> = ({ account, pending, onConfirm }) => {

  const styles = useStyles(useTheme())

  const hasConfirmUpdateAccount = account !== null
  let _account = { ...account }
  const [tmpAccount, setTmpAccount] = useState(_account)
  useEffect(() => { setTmpAccount(_account) }, [JSON.stringify(_account)])

  const saveFormField = (t: keyof LocalAccount) => (e: any) => {
    setTmpAccount({
      ...tmpAccount,
      [t]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(true, tmpAccount)
  }

  return (
    <Dialog open={hasConfirmUpdateAccount}>
      <form onSubmit={handleSubmit}>
        {hasConfirmUpdateAccount && (
          <Fragment>
            <DialogTitle>更新帐号信息</DialogTitle>
            <DialogContent>
              <TextField
                className={`${styles.input}`}
                label={'显示名'}
                required
                onChange={saveFormField('displayName')}
                value={tmpAccount.displayName}
                fullWidth
              />
              <TextField
                className={`${styles.input}`}
                label={'阿里云 AccessKey'}
                required
                disabled
                value={tmpAccount.accessKey}
                fullWidth
              />
              <TextField
                disabled
                className={`${styles.input}`}
                label={'认证凭据'}
                type='password'
                value={account.token}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              {
                pending
                  ? <Button color='primary' disabled>保存用户中</Button>
                  : (
                    <Fragment>
                      <Button color='primary' onClick={(e) => onConfirm(false)}>取消</Button>
                      <Button color='primary' type='submit' variant='contained'>更新</Button>
                    </Fragment>
                  )
              }
            </DialogActions>
          </Fragment>
        )}
      </form>
    </Dialog>
  )
}

