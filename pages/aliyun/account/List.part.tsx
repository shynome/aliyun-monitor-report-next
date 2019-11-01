import React, { useState, useEffect, Fragment } from "react";
import {
  List, ListItem, ListItemText, IconButton, ListItemSecondaryAction, Button,
} from "@material-ui/core";
import { LocalAccount } from "../account";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { localAccountStoreContainer } from "./useLocalAccountStore";
import { AccountPanelType, TabSelectStatusContainer } from "./TabSelectStatus";

import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog.c";

enum DeleteAccountStatus {
  Pending,
  Finished,
}

export const AccountList: React.StatelessComponent = () => {

  const { accountList, accountManager } = localAccountStoreContainer.useContainer()
  const [tmpDeleteAccount, setTmpDeleteAccount] = useState<LocalAccount>(null)
  const [tmpEditAccount, setTmpEditAccount] = useState<LocalAccount>(null)
  const [deleteAccountStatus, setDeleteAccountStatus] = useState<DeleteAccountStatus>(DeleteAccountStatus.Finished)

  const { setSelectedTab } = TabSelectStatusContainer.useContainer()

  const [startDeleteAccount, endDeleteAccount] = [() => setDeleteAccountStatus(DeleteAccountStatus.Pending), () => setDeleteAccountStatus(DeleteAccountStatus.Finished),]

  const _handleDeleteConfirm = async (confirm: boolean) => {
    if (!confirm) {
      return
    }
    startDeleteAccount()
    await accountManager.remove(tmpDeleteAccount)
  }
  const handleDeleteConfirm = (confirm: boolean) => {
    _handleDeleteConfirm(confirm).finally(() => {
      setTmpDeleteAccount(null)
      endDeleteAccount()
    })
  }

  return (
    <Fragment>
      <List>
        {accountList.map((account, index) => (
          <ListItem key={account.accessKey} divider={index !== (accountList.length - 1)} >
            <ListItemText primary={account.displayName} secondary={account.accessKey} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => setTmpDeleteAccount(account)}>
                <DeleteIcon />
              </IconButton>
              <IconButton>
                <EditIcon />
              </IconButton>
              <Button onClick={() => alert('未实现')} color='primary' variant='outlined'>
                进入该帐号
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button onClick={(e) => setSelectedTab(AccountPanelType.Add)} fullWidth size='large' variant='outlined' color='primary'>
        新增帐号
      </Button>
      <ConfirmDeleteDialog
        account={tmpDeleteAccount}
        onConfirm={handleDeleteConfirm}
        pending={deleteAccountStatus === DeleteAccountStatus.Pending}
      />
    </Fragment>
  )
}
