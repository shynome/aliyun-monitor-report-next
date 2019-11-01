
import React, { Fragment, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField,
} from "@material-ui/core";
import { LocalAccount } from "../account";

export interface OnConfirmUpdateAccount {
  (v: false): any
  (v: true, account: LocalAccount): any
}

export const UpdateAccountDialog: React.StatelessComponent<{ account: LocalAccount | null, pending: boolean, onConfirm: OnConfirmUpdateAccount }> = ({ account, pending, onConfirm }) => {

  const hasConfirmUpdateAccount = account !== null
  const [tmpAccount, setTmpAccount] = useState({ ...account })

  const saveFormField = (t: keyof LocalAccount) => (e: any) => {
    setTmpAccount({
      ...tmpAccount,
      [t]: e.target.value
    })
  }

  const handleSubmit = () => {
    onConfirm(true, tmpAccount)
  }

  return (
    <Dialog open={hasConfirmUpdateAccount}>
      <form onSubmit={handleSubmit}>
        {hasConfirmUpdateAccount && (
          <Fragment>
            <DialogTitle>: {account.displayName}</DialogTitle>
            <DialogContent>
              <TextField
                label={'显示名'}
                required
                onChange={saveFormField('displayName')}
                value={tmpAccount.displayName}
                fullWidth
              />
              <TextField
                label={'阿里云 AccessKey'}
                required
                onChange={saveFormField('accessKey')}
                value={tmpAccount.accessKey}
                fullWidth
              />
              <TextField
                disabled
                label={'认证凭据无法修改'}
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
                      <Button color='primary' type='submit' variant='contained'>保存</Button>
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

