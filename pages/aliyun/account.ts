
export interface LocalAccount {
  displayName: string
  token: string
  default: boolean
}

export class LocalAccountStore {
  private tmpAccount: LocalAccount[] = []
  private tmpAccountIndexes: number[] = []
  private tmpRawAccountIndexes: string = ''
  private initLock: Promise<any>
  static StorePrefixKey = 'account-index-'
  static StoreIndexesKey = 'account-indexes'
  static StoreOpLockKey = 'account-op-lock'
  constructor() {
    this.initLock = this.init()
  }
  async init() {
    this.tmpRawAccountIndexes = localStorage.getItem(LocalAccountStore.StoreIndexesKey)
    this.tmpAccountIndexes = JSON.parse(this.tmpRawAccountIndexes || '[]')
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
  async check() {
    await this.initLock
    let nowRawIndexes = localStorage.getItem(LocalAccountStore.StoreIndexesKey)
    // 如果现在的 Indexes 和早先的 Indexes 不同, 说明用户数据发生了更新, 进行重新初始化
    if (nowRawIndexes !== this.tmpRawAccountIndexes) {
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
    localStorage.setItem('account-op-lock', '0')
  }
  private withLock<T>(fn: T): T {
    let f: any = (...args: any[]) => {
      return Promise.resolve(this.lock())
        .then(this.check)
        .then(() => (fn as any)(...args))
        .then(this.unlock, this.unlock)
    }
    return f
  }
  async list() {
    await this.check()
    return this.tmpAccount
  }
  async add(account: LocalAccount) {
    return this.withLock(this._add)(account)
  }
  async remove(account: LocalAccount) {
    return this.withLock(this._remove)(account)
  }
  private async _add(account: LocalAccount) {
    this.tmpAccount.push(account)
    let index = this.tmpAccount.length
    this.tmpAccountIndexes.push(index)
    localStorage.setItem(LocalAccountStore.StorePrefixKey + index, JSON.stringify(account))
    localStorage.setItem(LocalAccountStore.StoreIndexesKey, JSON.stringify(this.tmpAccountIndexes))
    return account
  }
  private async _remove(account: LocalAccount) {
    let a = JSON.stringify(account)
    let aIndex = this.tmpAccount.map(v => JSON.stringify(v)).indexOf(a)
    let iIndex = this.tmpAccountIndexes.indexOf(aIndex)
    this.tmpAccountIndexes.splice(iIndex, 1)
    this.tmpAccount.splice(iIndex, 1)
    localStorage.removeItem(LocalAccountStore.StorePrefixKey + aIndex)
    localStorage.setItem(LocalAccountStore.StoreIndexesKey, JSON.stringify(this.tmpAccountIndexes))
  }
}

export const localAccountStore = new LocalAccountStore()
