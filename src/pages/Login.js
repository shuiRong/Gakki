/**
 * 登陆界面
 */

import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Linking,
  BackHandler
} from 'react-native'
import Header from './common/Header'
import { apps } from '../utils/api'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import { observer } from 'mobx-react'
import { Confirm } from './common/Notice'
import { Button } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { CancelToken } from 'axios'

let color = {}
@observer
export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canBack: false
    }
    this.cancel = null
  }

  componentDidMount() {
    const { navigate, getParam } = this.props.navigation

    const canBack = getParam('canBack')
    this.setState({
      canBack: canBack
    })
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canBack) {
        navigate('Home')
        return true
      }
      return false
    })
  }

  componentWillUnmount() {
    this.backHandler.remove()
    this.cancel && this.cancel()
  }

  openURL = url => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err))
  }

  createApps = () => {
    const domain = mobx.domain
    if (!domain) {
      return
    }
    apps(
      domain,
      {
        website: `https://${domain}`,
        client_name: 'Gakki',
        redirect_uris: 'https://linshuirong.cn',
        scopes: 'read write follow push'
      },
      {
        cancelToken: new CancelToken(c => (this.cancel = c))
      }
    ).then(({ client_id, client_secret }) => {
      this.props.navigation.navigate('Auth', {
        client_id,
        client_secret
      })
    })
  }

  showHelpInfo = () => {
    Confirm.show(
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: color.contrastColor, fontSize: 18 }}>
          Mastodon是一个开源的、符合GNU
          Social规范的去中心化社交网络，整个长毛象社区是由无数实例组成的。注册某实例后你不仅可以与本实例内的用户互动，并且可以与来自世界各地的其他实例中的用户无缝连接。
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text style={{ color: color.contrastColor, fontSize: 18 }}>
            不知道该选择哪个实例？
          </Text>
          <TouchableOpacity
            onPress={() => this.openURL('https://joinmastodon.org/')}
          >
            <Text style={{ color: color.subColor, fontSize: 18 }}>
              https://joinmastodon.org/
            </Text>
          </TouchableOpacity>
          <Text style={{ color: color.contrastColor, fontSize: 18 }}>
            可以帮助您了解更多信息。
          </Text>
        </View>
        <Text style={{ color: color.contrastColor, fontSize: 18 }}>
          域名是指你想要登陆的Mastodon实例的域名，比如：cmx.im、pawoo.net、mastodon.social
          ...
        </Text>
      </View>,
      () => {},
      {
        isModal: false,
        hideCancel: true,
        style: {
          height: 400,
          backgroundColor: color.themeColor
        }
      }
    )
  }

  render() {
    color = themeData[mobx.theme]
    return (
      <View
        style={{
          backgroundColor: color.themeColor,
          flex: 1
        }}
      >
        <Header
          left={
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('Home')}
            >
              <Icon
                style={{ color: color.subColor, fontSize: 17 }}
                name={'arrow-left'}
              />
            </Button>
          }
          title={''}
          right={'none'}
        />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image
            style={{
              overlayColor: color.themeColor,
              marginTop: 100,
              width: 300,
              height: 130,
              borderRadius: 5
            }}
            source={require('../assets/image/mastodon.jpg')}
          />
          <View style={{ width: 300, marginTop: 30 }}>
            <Text
              style={{
                fontSize: 13,
                color: color.subColor,
                alignSelf: 'flex-start'
              }}
            >
              域名
            </Text>
            <TextInput
              style={{
                padding: 3,
                paddingLeft: 0,
                fontSize: 20,
                borderWidth: 0,
                borderBottomWidth: 1,
                borderColor: color.contrastColor,
                color: color.contrastColor
              }}
              maxLength={20}
              onChangeText={text => mobx.updateDomain(text)}
              value={mobx.domain}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                width: 300,
                height: 40,
                marginTop: 30,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.contrastColor
              }}
              onPress={this.createApps}
            >
              <Text style={{ color: color.themeColor }}>登陆Mastodon账号</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.showHelpInfo}>
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  color: color.subColor,
                  alignSelf: 'center'
                }}
              >
                需要帮助？
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}
