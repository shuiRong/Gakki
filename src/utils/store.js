import { observable } from 'mobx'

class Globe {
  constructor() {}

  @observable reply_to = '' // 回复对象的username
  @observable reply_to_id = undefined // 回复对象的id

  updateReply(id, username) {
    this.reply_to = username
    this.reply_to_id = id
  }
}

const globe = new Globe()

export default globe
