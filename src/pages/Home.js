import React, { Component } from 'react'
import { View, StyleSheet, RefreshControl } from 'react-native'
import {
  Drawer,
  Container,
  Text,
  Content,
  Tab,
  Tabs,
  TabHeading,
  Fab
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
            <HeaderItem openDrawer={this.openDrawer} {...this.props} />
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => this.setState({ refreshing: true })}
                />
              }
            >
              <Tabs onChangeTab={this.tabChanged}>
                <Tab
                  heading={
                    <TabHeading>
                      {this.state.tab === 0 ? (
                        <Icon
                          style={{ ...styles.icon, color: '#fff' }}
                          name="home"
                        />
                      ) : (
                        <Icon style={styles.icon} name="home" />
                      )}
                      <Text>主页</Text>
                    </TabHeading>
                  }
                  activeTabStyle={{ color: 'pink' }}
                >
                  <HomeScreen
                    {...this.props}
                    url={'home'}
                    refreshing={this.state.refreshing}
                    finishRefresh={() => this.setState({ refreshing: false })}
                  />
                </Tab>
                <Tab
                  heading={
                    <TabHeading>
                      {this.state.tab === 1 ? (
                        <Icon
                          style={{ ...styles.icon, color: '#fff' }}
                          name="users"
                        />
                      ) : (
                        <Icon style={styles.icon} name="users" />
                      )}
                      <Text>本站</Text>
                    </TabHeading>
                  }
                >
                  <HomeScreen
                    {...this.props}
                    url={'public'}
                    query={{ local: true, only_media: false }}
                    refreshing={this.state.refreshing}
                    finishRefresh={() => this.setState({ refreshing: false })}
                  />
                </Tab>
                <Tab
                  heading={
                    <TabHeading>
                      {this.state.tab === 2 ? (
                        <Icon
                          style={{ ...styles.icon, color: '#fff' }}
                          name="globe-americas"
                        />
                      ) : (
                        <Icon style={styles.icon} name="globe-americas" />
                      )}
                      <Text>跨站</Text>
                    </TabHeading>
                  }
                >
                  <HomeScreen
                    {...this.props}
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

const styles = StyleSheet.create({
  icon: {
    color: '#bbb',
    fontSize: 17
  }
})
