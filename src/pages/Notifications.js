import React, { Component } from 'react'
import { View, Animated, StyleSheet, Dimensions } from 'react-native'
import { Button } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import HeaderItem from './common/Header'
import Tab from './notificationTab/index.js'
import ScrollableTabView, {
  DefaultTabBar
} from 'react-native-scrollable-tab-view'
import {
  getCustomEmojis,
  getCurrentUser,
  clearNotifications
} from '../utils/api'
import { themeData } from '../utils/color'
import { UserSpruce } from './common/Spruce'
import { save, fetch } from '../utils/store'
import mobx from '../utils/mobx'
import { observer } from 'mobx-react'
import { Confirm } from './common/Notice'
import { CancelToken } from 'axios'

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
    this.animatedEvent = Animated.event([
      {
        nativeEvent: {
          contentOffset: { y: this.state.headerTop }
        }
      }
    ])
  }

  componentDidMount() {
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
   * @description 清空通知
   */
  clearNotifications = () => {
    Confirm.show('确定清空所有通知吗？', () => {
      clearNotifications(mobx.domain, {
        cancelToken: new CancelToken(c => this.cancel.push(c))
      })
        .then(() => {
          this.setState({
            list: [],
            loading: false
          })
        })
        .catch(() => {
          this.setState({
            loading: false
          })
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
    const state = this.state
    color = themeData[mobx.theme]

    return (
      <View style={{ flex: 1, backgroundColor: color.themeColor }}>
        <View style={{ flex: 1 }}>
          <Animated.View style={{ top: this.top }}>
            <HeaderItem
              left={
                <Button transparent>
                  <Icon
                    style={[styles.icon, { color: color.subColor }]}
                    name={'arrow-left'}
                    onPress={() => this.props.navigation.goBack()}
                  />
                </Button>
              }
              title={'通知'}
              right={
                <Button transparent onPress={this.clearNotifications}>
                  <Icon
                    style={[styles.icon, { color: color.subColor }]}
                    name="trash-alt"
                  />
                </Button>
              }
            />
          </Animated.View>
          <Animated.View
            style={{
              height: deviceHeight,
              top: this.top
            }}
          >
            <ScrollableTabView
              initialPage={0}
              renderTabBar={() => (
                <DefaultTabBar
                  backgroundColor={color.themeColor}
                  activeTextColor={color.contrastColor}
                  activeTabStyle={{ fontSize: 20 }}
                  inactiveTextColor={color.subColor}
                  navigation={this.props.navigation}
                  underlineStyle={{
                    backgroundColor: 'transparent'
                  }}
                  style={{ borderColor: 'transparent' }}
                />
              )}
            >
              <Tab
                tabLabel={'所有'}
                navigation={this.props.navigation}
                onScroll={this.animatedEvent}
              />
              <Tab
                tabLabel={'提及'}
                params={{
                  exclude_types: ['follow', 'reblog', 'favourite', 'poll']
                }}
                navigation={this.props.navigation}
                onScroll={this.animatedEvent}
              />
              <Tab
                tabLabel={'收藏'}
                params={{
                  exclude_types: ['follow', 'reblog', 'mention', 'poll']
                }}
                navigation={this.props.navigation}
                onScroll={this.animatedEvent}
              />
              <Tab
                tabLabel={'转嘟'}
                params={{
                  exclude_types: ['follow', 'mention', 'favourite', 'poll']
                }}
                navigation={this.props.navigation}
                onScroll={this.animatedEvent}
              />
              <Tab
                tabLabel={'关注'}
                params={{
                  exclude_types: ['mention', 'reblog', 'favourite', 'poll']
                }}
                spruce={<UserSpruce />}
                navigation={this.props.navigation}
                onScroll={this.animatedEvent}
              />
              <Tab
                tabLabel={'投票'}
                params={{
                  exclude_types: ['follow', 'mention', 'favourite', 'reblog']
                }}
                navigation={this.props.navigation}
                onScroll={this.animatedEvent}
              />
            </ScrollableTabView>
          </Animated.View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 17
  }
})
