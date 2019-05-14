import React, { Component } from 'react'
import { View, Animated, Dimensions, BackHandler } from 'react-native'
import HeaderItem from './common/Header'
import Tab from './screen/index'
import Fab from './common/Fab'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import DefaultTabBar from './common/DefaultTabBar.home'
import { getCustomEmojis, getCurrentUser } from '../utils/api'
import { themeData } from '../utils/color'
import { save, fetch } from '../utils/store'
import mobx from '../utils/mobx'
import { observer } from 'mobx-react'
import { CancelToken } from 'axios'

/**
 * 主页
 */
let color = {}
const deviceHeight = Dimensions.get('window').height

@observer
export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      headerTop: new Animated.Value(0),
      emojiObj: {}
    }

    this.cancel = []
  }
  componentWillMount() {
    this.top = this.state.headerTop.interpolate({
      inputRange: [0, 270],
      outputRange: [0, -50],
      extrapolate: 'clamp'
    })
    this.distanceFromBottom = this.state.headerTop.interpolate({
      inputRange: [0, 70],
      outputRange: [28, -50],
      extrapolate: 'clamp'
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
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.props.navigation.isFocused()) {
        BackHandler.exitApp()
        return true
      }
      return false
    })
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

    if (!mobx.account || !mobx.account.id) {
      getCurrentUser(mobx.domain, null, {
        cancelToken: new CancelToken(c => this.cancel.push(c))
      }).then(res => {
        mobx.updateAccount(res)
      })
    }
  }

  componentWillUnmount() {
    this.backHandler.remove()
    this.cancel.forEach(cancel => cancel && cancel())
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
    getCustomEmojis(mobx.domain, {
      cancelToken: new CancelToken(c => this.cancel.push(c))
    }).then(res => {
      save('emojis', res).then(() => {})

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

      save('emojiObj', emojiObj).then(() => {})
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
    color = themeData[mobx.theme]

    return (
      <View style={{ flex: 1, backgroundColor: color.themeColor }}>
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
                tabRef={this.tabref}
                backgroundColor={color.themeColor}
                activeTextColor={color.contrastColor}
                activeTabStyle={{ fontSize: 20 }}
                inactiveTextColor={color.subColor}
                navigation={this.props.navigation}
                underlineStyle={{
                  backgroundColor: 'transparent'
                }}
                style={{ borderColor: 'transparent' }}
                goToPage={number => {
                  alert(number)
                }}
              />
            )}
          >
            <Tab
              tabLabel={'本站'}
              params={{ local: true, only_media: false }}
              onScroll={this.animatedEvent}
              index={0}
              navigation={this.props.navigation}
            />
            <Tab
              tabLabel={'主页'}
              url={'home'}
              onScroll={this.animatedEvent}
              index={1}
              navigation={this.props.navigation}
            />
            <Tab
              tabLabel={'跨站'}
              params={{ only_media: false }}
              index={2}
              onScroll={this.animatedEvent}
              navigation={this.props.navigation}
            />
          </ScrollableTabView>
        </Animated.View>
        <Animated.View
          style={{
            width: 50,
            height: 50,
            position: 'absolute',
            right: 28,
            bottom: mobx.hideSendTootButton ? this.distanceFromBottom : 28
          }}
        >
          <Fab navigation={this.props.navigation} />
        </Animated.View>
      </View>
    )
  }
}
