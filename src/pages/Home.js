import React, { Component } from 'react'
import { View, RefreshControl } from 'react-native'
import {
  Drawer,
  Container,
  Text,
  Content,
  Tab,
  Tabs,
  TabHeading,
  Fab,
  ScrollableTab
} from 'native-base'
import HeaderItem from './Header'
import Icon from 'react-native-vector-icons/FontAwesome5'
import SideBar from './SideBar'
import HomeScreen from './screen/HomeScreen'

/**
 * 主页
 */
export default class Home extends Component {
  state = {
    tab: 0,
    refreshing: false
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
          <Container>
            <HeaderItem
              openDrawer={this.openDrawer}
              navigation={this.props.navigation}
            />
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => this.setState({ refreshing: true })}
                />
              }
            >
              <Tabs
                onChangeTab={this.tabChanged}
                renderTabBar={() => <ScrollableTab />}
              >
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
              </Tabs>
            </Content>
            <Fab
              direction="up"
              style={{ backgroundColor: '#5067FF' }}
              position="bottomRight"
              onPress={() => this.props.navigation.navigate('SendToot')}
            >
              <Icon name="pen" />
            </Fab>
          </Container>
        </Drawer>
      </View>
    )
  }
}
