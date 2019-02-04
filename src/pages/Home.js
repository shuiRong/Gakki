import React, { Component } from 'react'
import { View, Animated } from 'react-native'
import HeaderItem from './common/Header'
import HomeScreen from './screen/HomeScreen'
import LocalScreen from './screen/LocalScreen'
import PublicScreen from './screen/PublicScreen'
import Fab from './common/Fab'
import ScrollableTabView, {
  DefaultTabBar
} from 'react-native-scrollable-tab-view'
import { getCustomEmojis, getCurrentUser } from '../utils/api'
import { themeData } from '../utils/color'
import { save, fetch } from '../utils/store'
import mobx from '../utils/mobx'
import { observer } from 'mobx-react'

/**
 * 主页
 */
let color = {}
let deviceHeight = require('Dimensions').get('window').height

@observer
export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      headerTop: new Animated.Value(0),
      emojiObj: {}
    }
  }
  componentWillMount() {
    this.top = this.state.headerTop.interpolate({
      inputRange: [0, 270, 271, 280],
      outputRange: [0, -50, -50, -50]
    })
    this.animatedEvent = Animated.event([
      {
        nativeEvent: {
          contentOffset: { y: this.state.headerTop }
        }
      }
    ])
  }

  componentDidMount() {
    alert(4)
    fetch('emojis').then(res => {
      // 检测是否保存有emoji数据，如果没有的话，从网络获取
      if (!res || !res.length) {
        // 如果之前没有存储，从网络获取
        this.getCustomEmojis()
        return
      }
      // 如果存在，则接着检测emoji 对象是否存在
      this.detectEmojiObj()
    })

    getCurrentUser().then(res => {
      mobx.updateAccount(res)
    })
  }

  componentWillUnmount() {
    this._navListener.remove()
  }

  /**
   * @description 检测emoji对象是否存在
   */
  detectEmojiObj = () => {
    fetch('emojiObj').then(res => {
      // 如果不存在，重新根据emoji数据生成字典
      if (!res || Object.keys(res).length) {
        this.translateEmoji()
        return
      }

      // 如果存在，保存一份到state中
      this.setState({
        emojiObj: res
      })
    })
  }

  /**
   * @description 从网络重新获取emojis数据
   */
  getCustomEmojis = () => {
    getCustomEmojis().then(res => {
      save('emojis', res)

      this.translateEmoji(res)
    })
  }

  /**
   * @description 转换emojis Array数据为Object数据，留作后面HTML渲染时用
   */

  translateEmoji = emojis => {
    const start = data => {
      const emojiObj = {}
      data.forEach(item => {
        emojiObj[':' + item.shortcode + ':'] = item.static_url
      })

      save('emojiObj', emojiObj)
      mobx.updateEmojiObj(emojiObj)
    }

    if (!emojis) {
      fetch('emojis').then(res => {
        start(res)
      })
      return
    }

    start(emojis)
  }

  render() {
    const state = this.state
    color = themeData[mobx.theme]

    return (
      <View style={{ flex: 1, backgroundColor: color.themeColor }}>
        <View style={{ flex: 1 }}>
          <Animated.View style={{ top: this.top }}>
            <HeaderItem title={'Gakki'} navigation={this.props.navigation} />
          </Animated.View>
          <Animated.View
            style={{
              height: deviceHeight,
              top: this.top
            }}
          >
            <ScrollableTabView
              initialPage={1}
              renderTabBar={() => (
                <DefaultTabBar
                  backgroundColor={color.themeColor}
                  activeTextColor={color.contrastColor}
                  inactiveTextColor={color.subColor}
                  underlineStyle={{
                    backgroundColor: color.contrastColor
                  }}
                  style={{ borderColor: color.subColor }}
                />
              )}
            >
              <LocalScreen
                tabLabel={'本站'}
                emojiObj={state.emojiObj}
                onScroll={this.animatedEvent}
                navigation={this.props.navigation}
              />
              <HomeScreen
                tabLabel={'主页'}
                emojiObj={state.emojiObj}
                onScroll={this.animatedEvent}
                navigation={this.props.navigation}
              />
              <PublicScreen
                tabLabel={'跨站'}
                emojiObj={state.emojiObj}
                onScroll={this.animatedEvent}
                navigation={this.props.navigation}
              />
            </ScrollableTabView>
          </Animated.View>
          <Fab navigation={this.props.navigation} />
        </View>
      </View>
    )
  }
}
