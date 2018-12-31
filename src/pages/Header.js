import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Header, Left, Body, Right, Button, Title } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { color } from '../utils/color'

export default class HeaderItem extends Component {
  render() {
    return (
      <Header style={this.props.style}>
        <Left>
          <Button transparent onPress={this.props.openDrawer}>
            <Icon style={styles.icon} name="bars" />
          </Button>
        </Left>
        <Body>
          <Title>Gakki</Title>
        </Body>
        <Right>
          <Button
            transparent
            onPress={() => this.props.navigation.navigate('Notifications')}
          >
            <Icon style={styles.icon} name="bell" />
          </Button>
          <Button
            transparent
            onPress={() => this.props.navigation.navigate('Search')}
          >
            <Icon style={styles.icon} name="search" />
          </Button>
        </Right>
      </Header>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    color: color.lightGrey,
    fontSize: 17
  }
})
