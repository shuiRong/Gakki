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
import { token } from '../utils/config'
import { CancelToken } from 'axios'
import SplashScreen from 'react-native-splash-screen'

let color = {}
@observer
export default class Login extends Component {
  constructor(props) {
    super(props)

    this.cancel = null
  }

  componentDidMount() {
    SplashScreen.hide()
    if (__DEV__) {
      mobx.updateDomain('cmx.im')
      save('access_token', token).then(() => {
        mobx.updateAccessToken(token)
        this.props.navigation.navigate('Home')
      })
    } else {
      const loginPage = () => this.props.navigation.navigate('Login')
      fetch('access_token').then(access_token => {
        if (!access_token) {
          loginPage()
          return
        }
        fetch('domain')
          .then(domain => {
            if (!domain) {
              loginPage()
              return
            }
            verify_credentials(domain, access_token, {
              cancelToken: new CancelToken(c => (this.cancel = c))
            }).then(({ name }) => {
              if (!name) {
                loginPage()
                return
              }
              mobx.updateDomain(domain)
              mobx.updateAccessToken(access_token)

              // 拉取用户数据到mobx中
              fetch('userData').then(userData => {
                mobx.updateUserData(userData)

                this.props.navigation.navigate('Home')
              })
            })
          })
          .catch(err => {
            console.log('er', err)
          })
      })
    }

    fetch('theme').then(theme => {
      if (theme) {
        mobx.updateTheme(theme)
      }
    })
  }

  componentWillUnmount() {
    this.cancel && this.cancel()
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
