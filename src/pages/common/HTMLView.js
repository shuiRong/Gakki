import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import { color } from '../../utils/color'
import HTML from 'react-native-render-html'

export default class HTMLView extends Component {
  static defaultProps = {
    hide: false,
    emojiObj: {}
  }
  constructor(props) {
    super(props)
    this.state = {
      content: '',
      hide: false, //当前内容是否被隐藏
      emojiObj: {}
    }
  }

  componentDidMount() {
    const props = this.props
    this.setState({
      content: props.data,
      hide: props.hide,
      emojiObj: props.emojiObj
    })
  }

  componentWillReceiveProps({ data, hide, emojiObj }) {
    this.setState({
      content: data,
      hide,
      emojiObj
    })
  }

  /**
   * @description 渲染HTML，并且返回该组件
   * 支持显示实例自定义的表情功能在此处实现，思路是：
   * 替换content中的表情shortcode为img标签。
   * 有个坑是：RN中<image />标签不支持inline-block样式；所以我用正则将每行html包裹在<div />标签中，然后div设置flexDirection:row，
   * 这样就能解决每行的img元素内联显示了
   */
  render() {
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
        html={content}
        tagsStyles={{
          ...tagsStyles,
          p: {
            ...tagsStyles.p,
            ...props.pTagStyle
          },
          a: {
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
    color: color.pColor,
    fontSize: 16,
    lineHeight: 20,
    flexWrap: 'wrap'
  },
  a: {
    color: color.themeColor,
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
