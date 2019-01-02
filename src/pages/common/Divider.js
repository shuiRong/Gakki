import React, { Component } from 'react'
import { View } from 'react-native'
import { color } from '../../utils/color'

export default class Divider extends Component {
  render() {
    return (
      <View
        style={{
          borderColor: color.lightGrey,
          borderWidth: 1,
          borderBottomWidth: 0
        }}
      />
    )
  }
}
