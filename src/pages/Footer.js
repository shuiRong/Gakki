import React, { Component } from 'react'
import { Footer, FooterTab, Button, Icon, Text } from 'native-base'
export default class FooterTabs extends Component {
  switchScreen = index => {
    
  }

  render() {
    return (
      <Footer>
        <FooterTab>
          <Button vertical active onPress={() => this.switchScreen(0)}>
            <Icon name="md-home" />
            <Text>主页</Text>
          </Button>
          <Button vertical onPress={() => this.switchScreen(1)}>
            <Icon name="users" />
            <Text>本站</Text>
          </Button>
          <Button vertical onPress={() => this.switchScreen(2)}>
            <Icon name="globe" />
            <Text>跨站</Text>
          </Button>
          <Button vertical onPress={() => this.switchScreen(3)}>
            <Icon name="md-notifications" />
            <Text>通知</Text>
          </Button>
        </FooterTab>
      </Footer>
    )
  }
}
