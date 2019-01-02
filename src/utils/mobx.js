import { observable } from 'mobx'

class Globe {
  constructor() {}

  @observable tab = 1
  @observable reply_to_username = '' // 回复对象的username
  @observable account = {} //当前用户的账户信息

  updateReply(username) {
    this.reply_to_username = username
  }

  updateAccount(account) {
    this.account = account
  }

  updateTab(tab) {
    this.tab = tab
  }
}

const globe = new Globe()

export default globe
