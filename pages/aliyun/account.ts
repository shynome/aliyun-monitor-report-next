
export interface LocalAccount {
  /**存储时的索引 */
  accessKey: string
  displayName: string
  token: string
}

export type AccountIndexes = {
  [k: string]: 1
}

export class LocalAccountStore {
  private tmpAccount: LocalAccount[] = []
  private tmpAccountIndexes: AccountIndexes = {}
  private tmpDataVersion: number = 0
  private initLock: Promise<any>
  static readonly StorePrefixKey = 'account-index-'
  static readonly StoreIndexesKey = 'account-indexes'
  static readonly StoreOpLockKey = 'account-op-lock'
  static readonly StoreDataVersionKey = 'account-data-version'
  static getDataVersion = () => Number(localStorage.getItem(LocalAccountStore.StoreDataVersionKey) || "0")
  static updateDataVersion = () => {
    let newDataVersion = LocalAccountStore.getDataVersion() + 1
    localStorage.setItem(LocalAccountStore.StoreDataVersionKey, newDataVersion.toString())
  }
  static getAccount = (accessKey: string): LocalAccount | null => {
    let t: LocalAccount
    try {
      let a = localStorage.getItem(LocalAccountStore.StorePrefixKey + accessKey)
      t = JSON.parse(a)
      return t
    } catch (err) {
      console.error(err)
      return null
    }
  }
  static getAccountIndexes = (): AccountIndexes => JSON.parse(localStorage.getItem(LocalAccountStore.StoreIndexesKey) || '{}')
  static setAccountIndexes = (v: AccountIndexes) => {
    localStorage.setItem(LocalAccountStore.StoreIndexesKey, JSON.stringify(v))
  }
  constructor() {
    if (!process.browser) {
      return
    }
    this.initLock = this.init()
  }
  init = async () => {
    this.tmpDataVersion = LocalAccountStore.getDataVersion()
    this.tmpAccountIndexes = LocalAccountStore.getAccountIndexes()
    this.tmpAccount = Object.keys(this.tmpAccountIndexes)
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
    // 如果现在的 DataVersion 和早先的 DataVersion 不同, 说明用户数据发生了更新, 进行重新初始化
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

    let indexes = LocalAccountStore.getAccountIndexes()

    if (indexes[account.accessKey]) {
      throw new Error('该用户已存在')
    }

    indexes[account.accessKey] = 1

    LocalAccountStore.setAccountIndexes(indexes)
    localStorage.setItem(LocalAccountStore.StorePrefixKey + account.accessKey, JSON.stringify(account))

  }
  private _remove = async (account: LocalAccount) => {

    let indexes = LocalAccountStore.getAccountIndexes()
    delete indexes[account.accessKey]
    LocalAccountStore.setAccountIndexes(indexes)

    localStorage.removeItem(LocalAccountStore.StorePrefixKey + account.accessKey)

  }
  private _update = async (account: LocalAccount) => {
    localStorage.setItem(LocalAccountStore.StorePrefixKey + account.accessKey, JSON.stringify(account))
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
