import React, { Component } from 'react'
import { View } from 'react-native'
import { Drawer, Container, Text, Content } from 'native-base'
import HeaderItem from './Header'
import FooterTabs from './Footer'
import SideBar from './SideBar'

/**
 * 主页
 */
export default class Home extends Component {
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
          content={<SideBar navigator={this.navigator} />}
          onClose={this.closeDrawer}
        >
          <Container>
            <HeaderItem openDrawer={this.openDrawer} />
            <Content>
              <View style={{ flex: 1, height: 500, backgroundColor: 'pink' }}>
                <Text>asdasd</Text>
              </View>
            </Content>
            <FooterTabs />
          </Container>
        </Drawer>
      </View>
    )
  }
}
