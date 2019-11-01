import { useState } from "react";
import { createContainer } from "unstated-next";
import { LocalAccountStore } from "../account";

export enum AccountPanelType {
  List = 'list',
  Add = 'add',
}

export const useTabSelectStatus = () => {
  const [selectedTab, setSelectedTab] = useState<AccountPanelType>(LocalAccountStore.getDefaultAccount() ? AccountPanelType.List : AccountPanelType.Add)
  return {
    selectedTab,
    setSelectedTab,
  }
}

export const TabSelectStatusContainer = createContainer(useTabSelectStatus)
