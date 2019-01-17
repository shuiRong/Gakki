import { observable } from 'mobx'

class Globe {
  constructor() {}

  @observable reply_to_username = undefined // 回复对象的username
  @observable in_reply_to_account_id = undefined // 回复对象的id
  @observable in_reply_to_id = undefined // 回复嘟文的id
  @observable mentions = [] // 当前嘟文提到的账号
  @observable account = {} // 当前用户的账户信息
  @observable cw = false // 输入框的CW模式
  @observable spoiler_text = undefined // CW模式的警告语
  @observable inputValue = '' // 输入框内容
  @observable theme = 'white' // 当前用户选择主题

  updateReply({
    reply_to_username,
    in_reply_to_account_id,
    in_reply_to_id,
    mentions,
    spoiler_text,
    cw
  }) {
    this.reply_to_username = reply_to_username
    this.mentions = mentions
    this.in_reply_to_account_id = in_reply_to_account_id
    this.in_reply_to_id = in_reply_to_id
    this.spoiler_text = spoiler_text
    this.cw = cw

    this.generateInputValue()
  }

  // 将被回复者信息和提及人信息置空
  resetReply() {
    this.reply_to_username = undefined
    this.mentions = []
    this.in_reply_to_account_id = undefined
    this.in_reply_to_id = undefined
    this.cw = false
    this.spoiler_text = undefined

    this.inputValue = ''
  }

  exchangeCW() {
    this.cw = !this.cw
  }
  updateSpoilerText(text) {
    this.spoiler_text = text
  }

  // 生成基础输入框内容（带有提及人信息的）
  generateInputValue() {
    let text = ''
    if (this.reply_to_username) {
      text = `@${this.reply_to_username} `
    }
    if (this.mentions.length) {
      text += this.mentions
        .map(account => {
          if (account.username === this.reply_to_username) {
            return ''
          }
          return `@${account.username} `
        })
        .join('')
    }
    this.inputValue = text
  }

  updateInputValue(text) {
    this.inputValue = text
  }

  addInputValue(text) {
    this.inputValue += text
  }

  updateAccount(account) {
    this.account = account
  }

  updateTheme(theme) {
    console.log('updateTheme', theme)
    this.theme = theme
  }
}

const globe = new Globe()

export default globe
