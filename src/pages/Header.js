import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Header, Left, Body, Right, Button, Title } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import { observer } from 'mobx-react'

let color = {}
@observer
export default class HeaderItem extends Component {
  render() {
    color = themeData[mobx.theme]
    return (
      <Header style={[this.props.style, { backgroundColor: color.themeColor }]}>
        <Left>
          <Button transparent onPress={this.props.openDrawer}>
            <Icon
              style={[styles.icon, { color: color.lightGrey }]}
              name="bars"
            />
          </Button>
        </Left>
        <Body>
          <Title style={{ color: color.secondColor }}>Gakki</Title>
        </Body>
        <Right>
          <Button
            transparent
            onPress={() => this.props.navigation.navigate('Notifications')}
          >
            <Icon
              style={[styles.icon, { color: color.lightGrey }]}
              name="bell"
            />
          </Button>
          <Button
            transparent
            onPress={() => this.props.navigation.navigate('Search')}
          >
            <Icon
              style={[styles.icon, { color: color.lightGrey }]}
              name="search"
            />
          </Button>
        </Right>
      </Header>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 17
  }
})
