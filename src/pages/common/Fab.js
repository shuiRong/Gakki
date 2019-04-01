import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { themeData } from '../../utils/color'
import mobx from '../../utils/mobx'
import { observer } from 'mobx-react'

let color = {}
@observer
export default class FabTool extends Component {
  sendToot = () => {
    mobx.resetReply()
    this.props.navigation.navigate('SendToot')
  }
  render() {
    color = themeData[mobx.theme]
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.sendToot}
        style={{
          width: 58,
          height: 58,
          borderRadius: 50,
          backgroundColor: color.contrastColor,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Icon
          name="pen"
          style={{
            fontSize: 22,
            color: color.themeColor
          }}
        />
      </TouchableOpacity>
    )
  }
}
