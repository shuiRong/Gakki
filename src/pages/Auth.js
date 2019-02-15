/**
 * 授权界面
 */

import React, { Component } from 'react'
import { View, WebView } from 'react-native'
import Header from './common/Header'
import { Button } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { getToken } from '../utils/api'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import { observer } from 'mobx-react'
import { save } from '../utils/store'

let color = {}
@observer
export default class Auth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      client_id: '',
      client_secret: '',
      domain: ''
    }
  }

  componentDidMount() {
    const { getParam } = this.props.navigation
    this.setState({
      client_id: getParam('client_id'),
      client_secret: getParam('client_secret'),
      domain: getParam('domain')
    })
  }

  getToken = code => {
    const state = this.state
    getToken({
      client_id: state.client_id,
      client_secret: state.client_secret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'https://linshuirong.cn'
    }).then(({ access_token }) => {
      mobx.updateAccessToken('Bearer ' + access_token)
      save('access_token', 'Bearer ' + access_token).then(() => {
        this.props.navigation.navigate('Home', {
          access_token: 'Bearer ' + access_token
        })
      })
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

    if (!state.domain) {
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
        {state.domain ? (
          <WebView
            source={{
              uri: `https://${
                state.domain
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
