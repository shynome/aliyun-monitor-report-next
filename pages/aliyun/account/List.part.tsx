import React, { useState, useEffect, Fragment } from "react";
import {
  List, ListItem, ListItemText, IconButton, ListItemSecondaryAction, Button,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from "@material-ui/core";
import { localAccountStore, LocalAccount } from "../account";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { localAccountStoreContainer } from "./useLocalAccountStore";
import { AccountPanelType, TabSelectStatusContainer } from "./TabSelectStatus";

enum DeleteAccountStatus {
  Pending,
  Finished,
}

export const AccountList: React.StatelessComponent = () => {

  const { accountList, accountManager } = localAccountStoreContainer.useContainer()
  const [tmpDeleteAccount, setTmpDeleteAccount] = useState<LocalAccount>(null)
  const [deleteAccountStatus, setDeleteAccountStatus] = useState<DeleteAccountStatus>(DeleteAccountStatus.Finished)

  const { setSelectedTab } = TabSelectStatusContainer.useContainer()

  const [startDeleteAccount, endDeleteAccount] = [() => setDeleteAccountStatus(DeleteAccountStatus.Pending), () => setDeleteAccountStatus(DeleteAccountStatus.Finished),]

  const deleteAccount = async () => {
    startDeleteAccount()
    await accountManager.remove(tmpDeleteAccount)
    setTmpDeleteAccount(null)
  }
  const hasConfirmDeleteAccount = tmpDeleteAccount !== null

  return (
    <Fragment>
      <List>
        {accountList.map((account) => (
          <ListItem key={account.index} divider={true}>
            <ListItemText>{account.displayName}</ListItemText>
            <ListItemSecondaryAction>
              <IconButton>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => setTmpDeleteAccount(account)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button onClick={(e) => setSelectedTab(AccountPanelType.Add)} fullWidth size='large' variant='outlined' color='primary'>
        新增帐号
      </Button>
      <Dialog open={hasConfirmDeleteAccount}>
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
                deleteAccountStatus === DeleteAccountStatus.Pending
                  ? <Button color='primary' disabled>删除用户中</Button>
                  : (
                    <Fragment>
                      <Button color='primary' onClick={(e) => setTmpDeleteAccount(null)}>取消</Button>
                      <Button color='primary' focusRipple onClick={(e) => deleteAccount().finally(endDeleteAccount)}>确认删除</Button>
                    </Fragment>
                  )
              }
            </DialogActions>
          </Fragment>
        )}
      </Dialog>
    </Fragment>
  )
}
