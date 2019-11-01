import React, { useState } from "react";
import { LocalAccountStore } from "../account";
import {
  AppBar, Tabs, Tab, Paper,
  makeStyles,
} from "@material-ui/core";
import { TabPanel } from "~modules/components/TabPanel";
import { AccountAdd } from "./Add.part";
import { AccountList } from "./List.part";

export enum AccountPanelType {
  List = 'list',
  Add = 'add',
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '600px',
    margin: '30px auto',
    overflow: 'hidden',
  }
}))

export const AccountPanel: React.StatelessComponent = () => {

  const styles = useStyles({})
  const [selected, setSelected] = useState<AccountPanelType>(LocalAccountStore.getDefaultAccount() ? AccountPanelType.List : AccountPanelType.Add)

  const handleChange = (e: React.ChangeEvent<{}>, newValue: AccountPanelType) => {
    setSelected(newValue)
  }

  return (
    <Paper className={`${styles.root}`}>
      <AppBar position='static'>
        <Tabs value={selected} onChange={handleChange} variant='fullWidth'>
          <Tab value={AccountPanelType.List} label='帐号列表' />
          <Tab value={AccountPanelType.Add} label='新增帐号' />
        </Tabs>
      </AppBar>
      <TabPanel value={selected} index={AccountPanelType.List}>
        <AccountList />
      </TabPanel>
      <TabPanel value={selected} index={AccountPanelType.Add}>
        <AccountAdd />
      </TabPanel>
    </Paper>
  )
}

export default AccountPanel
