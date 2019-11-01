
export interface LocalAccount {
  /**存储时的索引 */
  index?: string
  displayName: string
  token: string
}

export class LocalAccountStore {
  private tmpAccount: LocalAccount[] = []
  private tmpAccountIndexes: string[] = []
  private tmpDataVersion: number = 0
  private initLock: Promise<any>
  static readonly StorePrefixKey = 'account-index-'
  static readonly StoreIndexesKey = 'account-indexes'
  static readonly StoreOpLockKey = 'account-op-lock'
  static readonly StoreDefaultAccountIndexKey = 'account-defualt-index'
  static getDefaultAccount(): LocalAccount {
    let aIndex = localStorage.getItem(LocalAccountStore.StoreDefaultAccountIndexKey)
    return JSON.parse(localStorage.getItem(LocalAccountStore.StorePrefixKey + aIndex))
  }
  static setDefaultAccount(account: LocalAccount) {
    localStorage.setItem(LocalAccountStore.StoreDefaultAccountIndexKey, account.index)
  }
  static readonly StoreDataVersionKey = 'account-data-version'
  static getDataVersion = () => Number(localStorage.getItem(LocalAccountStore.StoreDataVersionKey) || "0")
  static updateDataVersion = () => {
    let newDataVersion = LocalAccountStore.getDataVersion() + 1
    localStorage.setItem(LocalAccountStore.StoreDataVersionKey, newDataVersion.toString())
  }
  static getAccountIndexes = (): string[] => JSON.parse(localStorage.getItem(LocalAccountStore.StoreIndexesKey) || '[]')
  constructor() {
    this.initLock = this.init()
  }
  init = async () => {
    this.tmpDataVersion = LocalAccountStore.getDataVersion()
    this.tmpAccountIndexes = LocalAccountStore.getAccountIndexes()
    this.tmpAccount = this.tmpAccountIndexes
      .map(index => LocalAccountStore.StorePrefixKey + index)
      .map(k => {
        try {
          let v = JSON.parse(localStorage.getItem(k))
          if (!v || !v.token) {
            return null
          }
          return v
        } catch (err) {
          return null
        }
      })
      .filter(v => v !== null)
  }
  check = async () => {
    await this.initLock
    let nowDataVersion = LocalAccountStore.getDataVersion()
    // 如果现在的 Indexes 和早先的 Indexes 不同, 说明用户数据发生了更新, 进行重新初始化
    if (nowDataVersion !== this.tmpDataVersion) {
      await (this.initLock = this.init())
    }
  }
  private lock = () => {
    if (localStorage.getItem('account-op-lock') === '1') {
      throw new Error('其他用户正在操作中')
    }
    localStorage.setItem('account-op-lock', '1')
  }
  private unlock = () => {
    LocalAccountStore.updateDataVersion()
    localStorage.setItem('account-op-lock', '0')
  }
  private withLock<T>(fn: T): T {
    let f: any = (...args: any[]) => {
      return Promise.resolve(this.lock())
        .then(this.check)
        .then(() => (fn as any)(...args))
        .then(this.unlock, (e) => {
          this.unlock()
          throw e
        })
    }
    return f
  }
  async list() {
    await this.check()
    return this.tmpAccount
  }
  private _add = async (account: LocalAccount) => {
    this.tmpAccount.push(account)
    let index = this.tmpAccount.length
    account.index = index.toString()
    this.tmpAccountIndexes.push(account.index)
    localStorage.setItem(LocalAccountStore.StorePrefixKey + index, JSON.stringify(account))
    localStorage.setItem(LocalAccountStore.StoreIndexesKey, JSON.stringify(this.tmpAccountIndexes))
    return account
  }
  private _remove = async (account: LocalAccount) => {
    let indexes = LocalAccountStore.getAccountIndexes()
    let newIndexes = indexes.filter(f => f !== account.index)
    localStorage.removeItem(LocalAccountStore.StorePrefixKey + account.index)
    localStorage.setItem(LocalAccountStore.StoreIndexesKey, JSON.stringify(newIndexes))
  }
  private _update = async (account: LocalAccount) => {
    if (typeof account.index === 'undefined') {
      throw new Error("update account need index key")
    }
    let aIndex = account.index
    localStorage.setItem(LocalAccountStore.StorePrefixKey + aIndex, JSON.stringify(account))
  }

  add = async (account: LocalAccount) => {
    return this.withLock(this._add)(account)
  }
  remove = async (account: LocalAccount) => {
    return this.withLock(this._remove)(account)
  }
  update = async (account: LocalAccount) => {
    return this.withLock(this._update)(account)
  }
}

export const localAccountStore = new LocalAccountStore()

export default localAccountStore
