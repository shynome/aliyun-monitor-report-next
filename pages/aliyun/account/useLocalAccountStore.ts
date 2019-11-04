import { createContainer } from "unstated-next";
import { useState, useMemo } from "react";
import { localAccountStore, LocalAccount } from "../account";

export class AccountManager {
  constructor(
    readonly setAccountList: (accountList: LocalAccount[]) => any,
  ) { }
  private __update = async () => {
    let accountList = await localAccountStore.list()
    this.setAccountList(accountList)
  }
  update = async (account: LocalAccount) => {
    await localAccountStore.update(account)
    await this.__update()
  }
  add = async (account: LocalAccount) => {
    await localAccountStore.add(account)
    await this.__update()
  }
  remove = async (account: LocalAccount) => {
    await localAccountStore.remove(account)
    await this.__update()
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
