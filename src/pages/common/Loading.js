import React, { Component } from 'react'
import { Spinner } from 'native-base'
import { observer } from 'mobx-react'
import mobx from '../../utils/mobx'
import { themeData } from '../../utils/color'

let color = {}
@observer
export default class Loading extends Component {
  render() {
    color = themeData[mobx.theme]
    return <Spinner style={{ marginTop: 250 }} color={color.contrastColor} />
  }
}
