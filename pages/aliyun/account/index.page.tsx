import React, { useEffect } from "react";
import {
  AppBar, Tabs, Tab, Paper,
  makeStyles,
} from "@material-ui/core";
import { TabPanel } from "~modules/components/TabPanel";
import { AccountAdd } from "./Add.part";
import { AccountList } from "./List.part";
import { localAccountStoreContainer } from "./useLocalAccountStore";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '600px',
    margin: '30px auto',
    overflow: 'hidden',
  }
}))

import { TabSelectStatusContainer, AccountPanelType } from "./TabSelectStatus";

export const AccountPanel: React.StatelessComponent = () => {

  const styles = useStyles({})
  const { selectedTab, setSelectedTab } = TabSelectStatusContainer.useContainer()
  const { accountManager } = localAccountStoreContainer.useContainer()

  useEffect(() => {
    accountManager.update()
  }, [])

  const handleChange = (e: React.ChangeEvent<{}>, newValue: AccountPanelType) => {
    setSelectedTab(newValue)
  }

  return (
    <Paper className={`${styles.root}`}>
      <AppBar position='static'>
        <Tabs value={selectedTab} onChange={handleChange} variant='fullWidth'>
          <Tab value={AccountPanelType.List} label='帐号列表' />
          <Tab value={AccountPanelType.Add} label='新增帐号' />
        </Tabs>
      </AppBar>
      <TabPanel value={selectedTab} index={AccountPanelType.List}>
        <AccountList />
      </TabPanel>
      <TabPanel value={selectedTab} index={AccountPanelType.Add}>
        <AccountAdd />
      </TabPanel>
    </Paper>
  )
}

export default () => (
  <localAccountStoreContainer.Provider>
    <TabSelectStatusContainer.Provider>
      <AccountPanel />
    </TabSelectStatusContainer.Provider>
  </localAccountStoreContainer.Provider>
)
