import React, { Component } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { Drawer, Fab } from 'native-base'
import HeaderItem from './Header'
import Icon from 'react-native-vector-icons/FontAwesome5'
import SideBar from './SideBar'
import HomeScreen from './screen/HomeScreen'
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
  tabChanged = ({ i }) => {
    this.setState({
      tab: i
    })
  }

  renderTab = () => {
    const tab = [
      {
        label: '本站',
        url: 'public',
        query: {}
      },
      {
        label: '主页',
        url: 'public',
        query: { local: true, only_media: false }
      },
      {
        label: '跨站',
        url: 'public',
        query: { only_media: false }
      }
    ]
    return tab.map(item => {
      return (
        <HomeScreen
          tabLabel={item.label}
          onScroll={this.animatedEvent}
          navigation={this.props.navigation}
          url={item.url}
          query={item.qurey}
          refreshing={this.state.refreshing}
          finishRefresh={() => this.setState({ refreshing: false })}
        />
      )
    })
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
                initialPage={0}
                renderTabBar={() => (
                  <DefaultTabBar
                    backgroundColor={'#3F51B5'}
                    activeTextColor={'#ddd'}
                    underlineStyle={{ backgroundColor: '#fff' }}
                  />
                )}
              >
                {this.renderTab()}
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
