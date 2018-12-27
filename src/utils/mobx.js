import { observable } from 'mobx'

class Globe {
  constructor() {}

  @observable tab = 1
  @observable reply_to = '' // 回复对象的username
  @observable reply_to_id = '' // 回复对象的id
  @observable account = {} //当前用户的账户信息

  updateReply(id, username) {
    this.reply_to = username
    this.reply_to_id = id
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
