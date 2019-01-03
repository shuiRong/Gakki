import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Fab } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { color } from '../../utils/color'
import mobx from '../../utils/mobx'

export default class FabTool extends Component {
  sendToot = () => {
    mobx.resetReply()
    this.props.navigation.navigate('SendToot')
  }
  render() {
    return (
      <Fab
        direction="up"
        style={styles.fab}
        position="bottomRight"
        onPress={this.sendToot}
      >
        <Icon name="pen" />
      </Fab>
    )
  }
}

const styles = StyleSheet.create({
  fab: { backgroundColor: color.lightHeaderBg }
})
