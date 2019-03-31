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
import codePush from 'react-native-code-push'
import { deploymentKey, token } from '../utils/config'

let color = {}
@observer
export default class Login extends Component {
  componentDidMount() {
    if (__DEV__) {
      save('access_token', token).then(() => {
        mobx.updateAccessToken(token)
        this.props.navigation.navigate('Home')
      })
    } else {
      codePush.sync({
        updateDialog: {
          appendReleaseDescription: true,
          descriptionPrefix: '更新内容：',
          title: '更新',
          mandatoryUpdateMessage: '',
          mandatoryContinueButtonLabel: '更新'
        },
        mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
        deploymentKey: deploymentKey
      })

      fetch('access_token').then(res => {
        if (!res) {
          this.props.navigation.navigate('Login')
          return
        }
        verify_credentials(res).then(({ name }) => {
          if (name) {
            mobx.updateAccessToken(res)
            this.props.navigation.navigate('Home')
          }
        })
      })
    }

    fetch('theme').then(theme => {
      if (theme) {
        mobx.updateTheme(theme)
      }
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
