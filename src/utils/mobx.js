import { observable } from 'mobx'

class Globe {
  constructor() {}

  @observable reply_to_username = undefined // 回复对象的username
  @observable in_reply_to_account_id = undefined // 回复对象的id
  @observable in_reply_to_id = undefined // 回复嘟文的id
  @observable mentions = [] // 当前嘟文提到的账号
  @observable cw = false // 输入框的CW模式
  @observable NSFW = false // 针对媒体内容的模式 not safe for work
  @observable spoiler_text = undefined // CW模式的警告语
  @observable inputValue = '' // 输入框内容
  @observable theme = 'white' // 当前用户选择主题   // black white
  @observable visibility = 'public' // 当前用户选择主题
  @observable emojiObj = {} // 当前实例的emoji对象
  @observable account = {} // 当前用户的账户信息
  @observable access_token = ''
  @observable domain = 'cmx.im' // 实例域名
  @observable userData = {} // 多用户、账户数据，token为key
  @observable enabled = true // 个人详情页面的下拉刷新组件是否启用
  @observable hideSendTootButton = false // 滑动时隐藏发嘟文按钮
  @observable alwaysShowSensitiveMedia = false // 总是显示媒体文件
  @observable homeTabRef = {} // 首页Tab的ref
  @observable profileTabRef = {} // 个人主页Tab的ref

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
    this.NSFW = true
  }

  exchangeNSFW() {
    // 在CW生效的情况下，不允许关闭NSFW
    if (this.cw) {
      return
    }
    this.NSFW = !this.NSFW
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
    this.theme = theme
  }

  updateVisibility(visibility) {
    this.visibility = visibility
  }

  updateEmojiObj(emojiObj) {
    this.emojiObj = emojiObj
  }

  updateAccessToken(access_token) {
    this.access_token = access_token
  }

  updateEnabled(status) {
    this.enabled = status
  }

  updateDomain(domain) {
    this.domain = domain
  }

  updateHideSendTooButtonStatus(status) {
    this.hideSendTootButton = status
  }

  updateAlwaysShowSensitiveMedia(status) {
    this.alwaysShowSensitiveMedia = status
  }

  updateHomeTabRef(ref, index) {
    this.homeTabRef[index] = ref
  }

  updateProfileTabRef(ref) {
    this.profileTabRef = ref
  }

  updateUserData(data) {
    this.userData = data
  }
}

const globe = new Globe()

export default globe
