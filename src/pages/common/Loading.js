import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import { Spinner } from 'native-base'
import { observer } from 'mobx-react'
import mobx from '../../utils/mobx'
import { themeData } from '../../utils/color'

let color = {}
@observer
export default class Loading extends Component {
  render() {
    color = themeData[mobx.theme]
    const barStyle = mobx.theme === 'black' ? 'light-content' : 'dark-content'

    return (
      <View>
        <Spinner
          style={{ backgroundColor: color.themeColor, flex: 1, marginTop: 50 }}
          color={color.contrastColor}
        />
        <StatusBar backgroundColor={color.themeColor} barStyle={barStyle} />
      </View>
    )
  }
}
