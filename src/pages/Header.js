import React, { Component } from 'react'
import {
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title
} from 'native-base'
export default class HeaderItem extends Component {
  render() {
    return (
      <Header>
        <Left>
          <Button transparent onPress={this.props.openDrawer}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>Mastodon</Title>
        </Body>
        <Right>
          <Button transparent>
            <Icon name="md-home" />
          </Button>
          <Button transparent>
            <Icon name="md-notifications" />
          </Button>
          <Button transparent>
            <Icon name="users" />
          </Button>
          <Button transparent>
            <Icon name="globe" />
          </Button>
        </Right>
      </Header>
    )
  }
}
