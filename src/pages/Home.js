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
import { color } from '../utils/color'

/**
 * 主页
 */
let deviceHeight = require('Dimensions').get('window').height
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

  closeDrawer = () => {
    this.drawer._root.close()
  }
  openDrawer = () => {
    this.drawer._root.open()
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: color.white }}>
        <Drawer
          ref={ref => {
            this.drawer = ref
          }}
          styles={{ mainOverlay: 0 }}
          content={<SideBar navigator={this.navigator} />}
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
                    backgroundColor={color.headerBg}
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
