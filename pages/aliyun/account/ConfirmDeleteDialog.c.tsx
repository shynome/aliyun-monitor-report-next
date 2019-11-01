
import React, { Fragment } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import { LocalAccount } from "../account";

export const ConfirmDeleteDialog: React.StatelessComponent<{ account: LocalAccount | null, pending: boolean, onConfirm: (v: boolean) => void }> = ({ account: tmpDeleteAccount, pending, onConfirm }) => {
  const hasConfirmDeleteAccount = tmpDeleteAccount !== null
  return (<Dialog open={hasConfirmDeleteAccount}>
    {hasConfirmDeleteAccount && (
      <Fragment>
        <DialogTitle>确认是否删除帐号: {tmpDeleteAccount.displayName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确认是否删除帐号: {tmpDeleteAccount.displayName} , 删除后只能重新添加该帐号
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {
            pending
              ? <Button color='primary' disabled>删除用户中</Button>
              : (
                <Fragment>
                  <Button color='primary' onClick={(e) => onConfirm(false)}>取消</Button>
                  <Button color='primary' focusRipple onClick={(e) => onConfirm(true)}>确认删除</Button>
                </Fragment>
              )
          }
        </DialogActions>
      </Fragment>
    )}
  </Dialog>)
}

