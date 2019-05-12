/**
 * 授权界面
 */

import React, { Component } from 'react'
import { View, WebView } from 'react-native'
import Header from './common/Header'
import { Button } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { getToken, getCurrentUser } from '../utils/api'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import { observer } from 'mobx-react'
import { save, fetch } from '../utils/store'
import { CancelToken } from 'axios'

let color = {}
@observer
export default class Auth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      client_id: '',
      client_secret: ''
    }
    this.cancelGetToken = null
    this.cancelGetCurrentUser = null
  }

  componentDidMount() {
    const { getParam } = this.props.navigation
    this.setState({
      client_id: getParam('client_id'),
      client_secret: getParam('client_secret')
    })
  }

  componentWillUnmount() {
    this.cancelGetToken()
    this.cancelGetCurrentUser()
  }

  getToken = code => {
    const state = this.state
    getToken(
      mobx.domain,
      {
        client_id: state.client_id,
        client_secret: state.client_secret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://linshuirong.cn'
      },
      {
        cancelToken: new CancelToken(c => (this.cancelGetToken = c))
      }
    )
      .then(({ access_token }) => {
        const token = 'Bearer ' + access_token
        mobx.updateAccessToken(token)

        Promise.all([
          save('domain', mobx.domain),
          save('access_token', token),
          fetch('userData'),
          getCurrentUser(mobx.domain, token, {
            cancelToken: new CancelToken(c => (this.cancelGetCurrentUser = c))
          })
        ]).then(result => {
          // 如果还没有数据，或不存在当前用户token，存一份
          let userData = result[2]
          const account = result[3]
          if (!userData || !userData[token]) {
            userData = {
              ...userData,
              [token]: { domain: mobx.domain, account }
            }
            save('userData', userData)
          }

          mobx.updateAccount(account)
          mobx.updateUserData(userData)
          this.props.navigation.navigate('Home', {
            access_token: token
          })
        })
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  navigationChangeHandler = ({ url }) => {
    if (!/linshuirong.cn\/\?code/.test(url)) {
      return
    }
    const code = url.match(/\?code=(.*)/)[1]
    this.getToken(code)
  }

  render() {
    color = themeData[mobx.theme]
    const state = this.state

    if (!mobx.domain || !state.client_id) {
      return null
    }

    return (
      <View style={{ backgroundColor: color.themeColor, flex: 1 }}>
        <Header
          left={
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon
                style={{ color: color.subColor, fontSize: 17 }}
                name={'arrow-left'}
              />
            </Button>
          }
          title={'授权'}
          right={'none'}
        />
        {mobx.domain ? (
          <WebView
            source={{
              uri: `https://${
                mobx.domain
              }/oauth/authorize?scope=read%20write%20follow%20push&response_type=code&redirect_uri=https://linshuirong.cn&client_id=${
                state.client_id
              }`
            }}
            onNavigationStateChange={this.navigationChangeHandler}
          />
        ) : (
          <View />
        )}
      </View>
    )
  }
}
