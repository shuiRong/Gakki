import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Header, Left, Body, Right, Button, Title } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import globe from '../utils/store'

export default class HeaderItem extends Component {
  render() {
    return (
      <Header>
        <Left>
          <Button transparent onPress={this.props.openDrawer}>
            <Icon style={styles.icon} name="bars" />
          </Button>
        </Left>
        <Body>
          <Title>Mastodon</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => globe.updateScreen(0)}>
            <Icon style={styles.icon} name="home" />
          </Button>
          <Button transparent onPress={() => globe.updateScreen(1)}>
            <Icon style={styles.icon} name="bell" />
          </Button>
          <Button transparent onPress={() => globe.updateScreen(2)}>
            <Icon style={styles.icon} name="users" />
          </Button>
          <Button transparent onPress={() => globe.updateScreen(3)}>
            <Icon style={styles.icon} name="globe-americas" />
          </Button>
        </Right>
      </Header>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    color: '#fff',
    fontSize: 17
  }
})
