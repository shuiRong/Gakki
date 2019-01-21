import React, { Component } from 'react'
import { View } from 'react-native'
import { themeData } from '../../utils/color'
import { observer } from 'mobx-react'
import mobx from '../../utils/mobx'

let color = {}
@observer
export default class Divider extends Component {
  render() {
    color = themeData[mobx.theme]

    return (
      <View
        style={{
          borderColor: color.lightThemeColor,
          borderWidth: 1,
          borderBottomWidth: 0,
          ...this.props.style
        }}
      />
    )
  }
}
