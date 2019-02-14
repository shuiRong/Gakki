import React, { Component } from 'react'
import { Dimensions, Linking } from 'react-native'
import { themeData } from '../../utils/color'
import mobx from '../../utils/mobx'
import HTML from 'react-native-render-html'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

let color = {}
@observer
export default class HTMLView extends Component {
  static propTypes = {
    hide: PropTypes.bool,
    mentions: PropTypes.array,
    data: PropTypes.string.isRequired,
    navigation: PropTypes.object,
    pTagStyle: PropTypes.object,
    aTagStyle: PropTypes.object,
    containerStyle: PropTypes.object
  }

  static defaultProps = {
    hide: false,
    mentions: [],
    pTagStyle: {},
    aTagStyle: {},
    containerStyle: {}
  }

  constructor(props) {
    super(props)
    this.state = {
      content: '',
      hide: false, //当前内容是否被隐藏
      emojiObj: mobx.emojiObj
    }
  }

  componentDidMount() {
    const props = this.props
    this.setState({
      content: props.data,
      hide: props.hide
    })
  }

  componentWillReceiveProps({ data, hide }) {
    this.setState({
      content: data,
      hide
    })
  }

  /**
   * @description 识别几种类型的链接，分别做单独处理
   * 1. https://cmx.im/tags/test 站内Tag
   * 2. https://cmx.im/@shuiRong 站内用户
   * 3. https://cmx.im/web/statuses/101481412010558879 站内嘟文
   * 4. http://bing.com 站外链接
   * @param {link}: 点击的链接
   */
  onLinkPress = (_, link) => {
    const navigate = this.props.navigation.navigate
    let target
    if (/https:\/\/cmx\.im\/tags\//.test(link)) {
      target = link.match(/https:\/\/cmx\.im\/tags\/(.*)/)[1]

      navigate('Tag', {
        id: target
      })
    } else if (/https:\/\/cmx\.im\/@/.test(link)) {
      const mentions = this.props.mentions
      target = link.match(/https:\/\/cmx\.im\/@(.*)/)[1]
      const user = mentions.filter(user => user.username === target)[0]

      if (!user) {
        // 如果拿不到用户的id数据，那么就直接通过浏览器内打开该用户主页（比如个人主页时获取用户详情的接口没有返回mentions数据）
        Linking.openURL(link).then(err => {
          console.log('Linking.openURL error:', err)
        })
        return
      }
      navigate('Profile', {
        id: user.id
      })
    } else if (/https:\/\/cmx\.im\/web\/statuses\//.test(link)) {
      target = link.match(/https:\/\/cmx\.im\/web\/statuses\/(.*)/)[1]

      navigate('TootDetail', {
        id: target
      })
    } else if (!/https:\/\/cmx\.im/.test(link)) {
      Linking.openURL(link).then(err => {
        console.log('Linking.openURL error:', err)
      })
      return
    }
  }

  /**
   * @description 渲染HTML，并且返回该组件
   * 支持显示实例自定义的表情功能在此处实现，思路是：
   * 替换content中的表情shortcode为img标签。
   * 有个坑是：RN中<image />标签不支持inline-block样式；所以我用正则将每行html包裹在<div />标签中，然后div设置flexDirection:row，
   * 这样就能解决每行的img元素内联显示了
   */
  render() {
    color = themeData[mobx.theme]
    const state = this.state
    const props = this.props
    if (state.hide) {
      return null
    }
    let content = state.content

    // 首个字符必须是字母数组
    if (/:[A-Za-z0-9].*?:/.test(content)) {
      if (/<br \/>/.test(content)) {
        contentArray = content
          .replace(/^<p>/, '')
          .replace(/<\/p>$/, '<br />')
          .match(/(.*?)<br \/>/g)
        const newArray = contentArray.map(
          item => `<div>${item.replace(/<\/br >/, '')}</div>`
        )
        content = `<p>${newArray.join('')}</p>`
      } else {
        // 没有匹配到换行符号，说明是一行内容，那么将此行内容包含在div标签中，当然，最外层还是p标签
        content = content.replace(/^<p>(.*)<\/p>$/, '<p><div>$1</div></p>')
      }
      const match = content.match(/:[A-Za-z0-9].*?:/g)

      // 如果的确匹配到了任何表情包的shortcode
      if (match) {
        match.forEach(item => {
          if (item.length > 10) {
            return
          }
          const reg = new RegExp(item, 'g')
          content = content.replace(
            reg,
            `<img src="${state.emojiObj[item]}" />`
          )
        })
      }
    }

    // 如果开头没有<p>，说明是用户的displayName，内容没有包裹在p标签内，手动加上
    if (!/^<p>/.test(content)) {
      content = `<p><div>${content}</div></p>`
    }

    return (
      <HTML
        onLinkPress={this.onLinkPress}
        html={content}
        tagsStyles={{
          ...tagsStyles,
          p: {
            color: color.contrastColor,
            ...tagsStyles.p,
            ...props.pTagStyle
          },
          a: {
            color: color.subColor,
            ...tagsStyles.a,
            ...props.aTagStyle
          }
        }}
        imagesMaxWidth={Dimensions.get('window').width}
        containerStyle={props.containerStyle}
      />
    )
  }
}

const tagsStyles = {
  p: {
    fontSize: 16,
    lineHeight: 20,
    flexWrap: 'wrap'
  },
  a: {
    textDecorationLine: 'none'
  },
  img: {
    width: 17,
    height: 17,
    marginRight: 3,
    marginLeft: 3
  },
  div: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
}
