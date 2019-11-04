import { createContainer } from "unstated-next";
import { useState, useMemo } from "react";
import { localAccountStore, LocalAccount } from "../account";

export class AccountManager {
  constructor(
    readonly setAccountList: (accountList: LocalAccount[]) => any,
  ) { }
  updateState = async () => {
    let accountList = await localAccountStore.list()
    this.setAccountList(accountList)
  }
  update = async (account: LocalAccount) => {
    await localAccountStore.update(account)
    await this.updateState()
  }
  add = async (account: LocalAccount) => {
    await localAccountStore.add(account)
    await this.updateState()
  }
  remove = async (account: LocalAccount) => {
    await localAccountStore.remove(account)
    await this.updateState()
  }
}

export const useLocalAccountStore = () => {

  const [accountList, setAccountList] = useState<LocalAccount[]>([])

  return {
    accountList,
    accountManager: new AccountManager(setAccountList),
  }

}

export const localAccountStoreContainer = createContainer(useLocalAccountStore)
