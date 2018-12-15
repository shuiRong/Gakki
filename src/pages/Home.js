import React, { Component } from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react'
import { Drawer, Container, Text, Content } from 'native-base'
import HeaderItem from './Header'
import FooterTabs from './Footer'
import SideBar from './SideBar'
import { globe } from '../utils/store'

alert(JSON.stringify(globe))

/**
 * 主页
 */
@observer
export default class Home extends Component {
  closeDrawer = () => {
    this.drawer._root.close()
  }
  openDrawer = () => {
    this.drawer._root.open()
  }
  componentDidMount() {
    this.openDrawer()
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
          <Container>
            <HeaderItem openDrawer={this.openDrawer} />
            <Content>
              <View style={{ flex: 1, height: 500, backgroundColor: 'pink' }}>
                <Text>asdasd</Text>
                <Text>{globe && globe.count}</Text>
              </View>
            </Content>
            <FooterTabs />
          </Container>
        </Drawer>
      </View>
    )
  }
}
