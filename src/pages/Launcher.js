/**
 * 登陆界面
 */

import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import { verify_credentials } from '../utils/api'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import { observer } from 'mobx-react'
import { fetch } from '../utils/store'
import Spinner from 'react-native-spinkit'

let color = {}
@observer
export default class Login extends Component {
  componentDidMount() {
    fetch('access_token').then(res => {
      if (!res) {
        this.props.navigation.navigate('Login')
        return
      }
      verify_credentials(res).then(({ name }) => {
        if (name) {
          this.props.navigation.navigate('Home', {
            access_token: res
          })
        }
      })
    })
  }

  render() {
    color = themeData[mobx.theme]

    return (
      <View
        style={{
          backgroundColor: color.themeColor,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <StatusBar backgroundColor={color.themeColor} />
        <Spinner
          style={{ marginTop: -40 }}
          isVisible={true}
          size={100}
          type={'ChasingDots'}
          color={color.contrastColor}
        />
      </View>
    )
  }
}
