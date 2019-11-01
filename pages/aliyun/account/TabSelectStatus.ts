import { useState } from "react";
import { createContainer } from "unstated-next";
import { LocalAccountStore } from "../account";

export enum AccountPanelType {
  List = 'list',
  Add = 'add',
}

export const useTabSelectStatus = () => {
  const AccountLength = Object.keys(LocalAccountStore.getAccountIndexes()).length
  const [selectedTab, setSelectedTab] = useState<AccountPanelType>(AccountLength ? AccountPanelType.List : AccountPanelType.Add)
  return {
    selectedTab,
    setSelectedTab,
  }
}

export const TabSelectStatusContainer = createContainer(useTabSelectStatus)
