import React, { Component } from 'react'
import { View, Animated } from 'react-native'
import { Drawer } from 'native-base'
import HeaderItem from './Header'
import SideBar from './SideBar'
import HomeScreen from './screen/HomeScreen'
import LocalScreen from './screen/LocalScreen'
import PublicScreen from './screen/PublicScreen'
import Fab from './common/Fab'
import ScrollableTabView, {
  DefaultTabBar
} from 'react-native-scrollable-tab-view'
import { getCustomEmojis } from '../utils/api'
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
      headerTop: new Animated.Value(0)
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
    // this.openDrawer()
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
  }

  /**
   * @description 检测emoji对象是否存在
   */
  detectEmojiObj = () => {
    fetch('emojiObj').then(res => {
      // 如果不存在，重新根据emoji数据生成字典
      if (!res || Object.keys(res).length) {
        this.translateEmoji()
      }
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
    }

    if (!emojis) {
      fetch('emojis').then(res => {
        start(res)
      })
      return
    }

    start(emojis)
  }

  closeDrawer = () => {
    this.drawer._root.close()
  }
  openDrawer = () => {
    this.drawer._root.open()
  }

  render() {
    color = themeData[mobx.theme]

    return (
      <View style={{ flex: 1, backgroundColor: color.white }}>
        <Drawer
          ref={ref => {
            this.drawer = ref
          }}
          styles={{ mainOverlay: 0 }}
          content={
            <SideBar
              navigator={this.navigator}
              navigation={this.props.navigation}
            />
          }
          onClose={this.closeDrawer}
        >
          <View style={{ flex: 1 }}>
            <Animated.View style={{ top: this.top }}>
              <HeaderItem
                openDrawer={this.openDrawer}
                navigation={this.props.navigation}
              />
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
                    activeTextColor={color.lightGrey}
                    underlineStyle={{ backgroundColor: color.white }}
                  />
                )}
              >
                <LocalScreen
                  tabLabel={'本站'}
                  onScroll={this.animatedEvent}
                  navigation={this.props.navigation}
                />
                <HomeScreen
                  tabLabel={'主页'}
                  onScroll={this.animatedEvent}
                  navigation={this.props.navigation}
                />
                <PublicScreen
                  tabLabel={'跨站'}
                  onScroll={this.animatedEvent}
                  navigation={this.props.navigation}
                />
              </ScrollableTabView>
            </Animated.View>
            <Fab navigation={this.props.navigation} />
          </View>
        </Drawer>
      </View>
    )
  }
}
