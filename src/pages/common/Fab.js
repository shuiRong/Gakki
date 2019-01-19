import React, { Component } from 'react'
import { Fab } from 'native-base'
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
      <Fab
        direction="up"
        style={{ backgroundColor: color.contrastColor }}
        position="bottomRight"
        onPress={this.sendToot}
      >
        <Icon name="pen" />
      </Fab>
    )
  }
}
