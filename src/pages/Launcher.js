/**
 * 登陆界面
 */

import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import { verify_credentials } from '../utils/api'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import { observer } from 'mobx-react'
import { fetch, save } from '../utils/store'
import Spinner from 'react-native-spinkit'

let color = {}
@observer
export default class Login extends Component {
  componentDidMount() {
    let token =
      'Bearer 03547c4c9345a9e1629b5475424285adfda18c9c2c8a9390e2e71a10e97868cf'
    save('access_token', token).then(() => {
      mobx.updateAccessToken(token)
      this.props.navigation.navigate('Home', {
        access_token: token
      })
    })

    return
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
    const barStyle = mobx.theme === 'black' ? 'light-content' : 'dark-content'

    return (
      <View
        style={{
          backgroundColor: color.themeColor,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <StatusBar backgroundColor={color.themeColor} barStyle={barStyle} />
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
