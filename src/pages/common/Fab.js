import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Fab } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { color } from '../../utils/color'

export default class FabTool extends Component {
  render() {
    return (
      <Fab
        direction="up"
        style={styles.fab}
        position="bottomRight"
        onPress={() => this.props.navigation.navigate('SendToot')}
      >
        <Icon name="pen" />
      </Fab>
    )
  }
}

const styles = StyleSheet.create({
  fab: { backgroundColor: color.lightHeaderBg }
})
