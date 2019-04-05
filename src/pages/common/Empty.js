import React, { Component } from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import { themeData } from '../../utils/color'
import { observer } from 'mobx-react'
import mobx from '../../utils/mobx'

let color = {}
@observer
export default class Empty extends Component {
  static propTypes = {
    style: PropTypes.object,
    text: PropTypes.string
  }

  static defaultProps = {
    text: '内容为空',
    style: {}
  }

  render() {
    color = themeData[mobx.theme]

    return (
      <View
        style={{
          height: 400,
          justifyContent: 'center',
          alignItems: 'center',
          ...this.props.style
        }}
      >
        <Text
          style={{
            color: color.subColor,
            textAlign: 'center'
          }}
        >
          {this.props.text}
        </Text>
      </View>
    )
  }
}
