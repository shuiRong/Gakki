import React, { Component } from 'react'
import { View, RefreshControl, Animated, Easing } from 'react-native'
import {
  Drawer,
  Text,
  Content,
  Tab,
  Tabs,
  TabHeading,
  Fab,
  Container,
  ScrollableTab
} from 'native-base'
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
      tab: 0,
      headerTop: new Animated.Value(0)
    }
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

  componentDidMount() {}

  render() {
    const top = this.state.headerTop.interpolate({
      inputRange: [0, 270],
      outputRange: [0, -50]
    })
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
            <Animated.View style={{ top: top }}>
              <HeaderItem
                openDrawer={this.openDrawer}
                navigation={this.props.navigation}
              />
            </Animated.View>
            {/* <Tabs onChangeTab={this.tabChanged}>
              <Tab
                heading={
                  <TabHeading>
                    <Text>主页</Text>
                  </TabHeading>
                }
              >
                <HomeScreen
                  navigation={this.props.navigation}
                  url={'home'}
                  refreshing={this.state.refreshing}
                  finishRefresh={() => this.setState({ refreshing: false })}
                />
              </Tab>
              <Tab
                heading={
                  <TabHeading>
                    <Text>本站</Text>
                  </TabHeading>
                }
              >
                <HomeScreen
                  navigation={this.props.navigation}
                  url={'public'}
                  query={{ local: true, only_media: false }}
                  refreshing={this.state.refreshing}
                  finishRefresh={() => this.setState({ refreshing: false })}
                />
              </Tab>
              <Tab
                heading={
                  <TabHeading>
                    <Text>跨站</Text>
                  </TabHeading>
                }
              >
                <HomeScreen
                  navigation={this.props.navigation}
                  url={'public'}
                  query={{ only_media: false }}
                  refreshing={this.state.refreshing}
                  finishRefresh={() => this.setState({ refreshing: false })}
                />
              </Tab>
            </Tabs> */}
            <Animated.View
              style={{
                height: deviceHeight,
                top: top,
                backgroundColor: 'pink'
              }}
            >
              <ScrollableTabView
                // style={{ top: this.state.headerTop }}
                initialPage={1}
                renderTabBar={() => (
                  <DefaultTabBar
                    backgroundColor={'#3F51B5'}
                    activeTextColor={'#ddd'}
                    underlineStyle={{ backgroundColor: '#fff' }}
                  />
                )}
              >
                <HomeScreen
                  tabLabel="React"
                  onScroll={Animated.event([
                    {
                      nativeEvent: {
                        contentOffset: { y: this.state.headerTop }
                      }
                    }
                  ])}
                  navigation={this.props.navigation}
                  url={'public'}
                  query={{ local: true, only_media: false }}
                  refreshing={this.state.refreshing}
                  finishRefresh={() => this.setState({ refreshing: false })}
                />
                <HomeScreen
                  tabLabel="React2"
                  onScroll={Animated.event([
                    {
                      nativeEvent: {
                        contentOffset: { y: this.state.headerTop }
                      }
                    }
                  ])}
                  navigation={this.props.navigation}
                  url={'public'}
                  query={{ local: true, only_media: false }}
                  refreshing={this.state.refreshing}
                  finishRefresh={() => this.setState({ refreshing: false })}
                />
                <HomeScreen
                  tabLabel="React3"
                  onScroll={Animated.event([
                    {
                      nativeEvent: {
                        contentOffset: { y: this.state.headerTop }
                      }
                    }
                  ])}
                  navigation={this.props.navigation}
                  url={'public'}
                  query={{ local: true, only_media: false }}
                  refreshing={this.state.refreshing}
                  finishRefresh={() => this.setState({ refreshing: false })}
                />
              </ScrollableTabView>
            </Animated.View>
            <Fab
              direction="up"
              style={{ backgroundColor: '#5067FF' }}
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
