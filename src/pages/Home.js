import React, { Component } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { Drawer, Fab } from 'native-base'
import HeaderItem from './Header'
import Icon from 'react-native-vector-icons/FontAwesome5'
import SideBar from './SideBar'
import HomeScreen from './screen/HomeScreen'
import LocalScreen from './screen/LocalScreen'
import PublicScreen from './screen/PublicScreen'
import ScrollableTabView, {
  DefaultTabBar
} from 'react-native-scrollable-tab-view'

/**
 * 主页
 */
let deviceHeight = require('Dimensions').get('window').height
export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      headerTop: new Animated.Value(0),
      tab: 1
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
      <View style={{ flex: 1 }}>
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
                onChangeTab={({ i }) => this.setState({ tab: i })}
                renderTabBar={() => (
                  <DefaultTabBar
                    backgroundColor={'#3F51B5'}
                    activeTextColor={'#ddd'}
                    underlineStyle={{ backgroundColor: '#fff' }}
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
            <Fab
              direction="up"
              style={styles.fab}
              position="bottomRight"
              onPress={() => this.props.navigation.navigate('SendToot')}
            >
              <Icon name="pen" />
            </Fab>
          </View>
        </Drawer>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fab: { backgroundColor: '#5067FF' }
})
