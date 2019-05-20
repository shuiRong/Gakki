import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity
} from 'react-native'
import { getCurrentUser } from '../utils/api'
import mobx from '../utils/mobx'
import { themeData } from '../utils/color'
import HTMLView from './common/HTMLView'
import Divider from './common/Divider'
import { observer } from 'mobx-react'
import { remove, save, fetch } from '../utils/store'
import { CancelToken } from 'axios'
import RNRestart from 'react-native-restart'

let color = {}
@observer
export default class SideBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      avatar: '',
      header: '',
      domain: mobx.domain,
      display_name: '',
      id: '',
      black: false,
      white: true,
      night: false,
      showMultiAccount: false
    }
  }
  componentDidMount() {
    const update = data => {
      this.setState({
        avatar: data.avatar,
        username: data.username,
        header: data.header,
        display_name: data.display_name,
        id: data.id
      })
    }

    // 如果没获取到的account数据，重新拉取
    if (!mobx.account || !mobx.account.id) {
      getCurrentUser(mobx.domain, null, {
        cancelToken: new CancelToken(c => (this.cancel = c))
      }).then(res => {
        update(res)
        mobx.updateAccount(res)
      })
    } else {
      update(mobx.account)
    }
  }

  componentWillUnmount() {
    this.cancel && this.cancel()
  }

  // 删除存储的access_token等信息，进入到登录页面
  signout = () => {
    fetch('userData').then(userData => {
      const tempData = { ...userData }
      delete tempData[mobx.access_token]

      Promise.all([remove('access_token'), save('userData', tempData)])
        .then(() => {
          // 如果存储的没有其他账号数据了，那么就跳到登陆界面，如果还有账号，就自动登陆此账号。
          const keys = Object.keys(tempData)
          if (!keys.length) {
            this.props.navigation.navigate('Login')
            return
          }
          const nextAccount = tempData[keys[0]]

          Promise.all([
            save('access_token', keys[0]),
            save('domain', nextAccount.domain)
          ]).then(() => {
            RNRestart.Restart()
          })
        })
        .catch(err => {
          console.log('er', err)
        })
    })
  }

  /**
   * @description 从所有账户数据中，筛选出当前登陆账户外的账户数据
   * @param {}:
   */
  getOtherUserData = () => {
    const keys = Object.keys(mobx.userData)
    if (keys.length === 1) {
      return []
    }
    const result = []
    keys.forEach(key => {
      const data = mobx.userData[key]
      const account = data.account
      if (mobx.account.id !== account.id) {
        result.push({
          ...account,
          access_token: key,
          domain: data.domain
        })
      }
    })

    return result
  }

  /**
   * @description 获取其他账户头像
   */
  getOtherAccount() {
    const result = this.getOtherUserData()
    if (!result || !result.length) return null

    return result.map(data => {
      if (!data) return null
      return (
        <TouchableOpacity
          key={data.access_token}
          style={{
            ...styles.image,
            height: 35,
            width: 35,
            margin: 5,
            overflow: 'hidden'
          }}
          activeOpacity={0.5}
          onPress={() => {
            this.exchangeAccount(data)
          }}
        >
          <Image
            source={{ uri: data.avatar }}
            style={[styles.image, { height: 35, width: 35 }]}
          />
        </TouchableOpacity>
      )
    })
  }

  getOtherAccountList = () => {
    const result = this.getOtherUserData()
    if (!result || !result.length) return null

    return result.map(data => {
      if (!data) return null
      return (
        <TouchableOpacity
          key={data.access_token}
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={() => {
            this.exchangeAccount(data)
          }}
        >
          <View
            style={{
              ...styles.image,
              margin: 10,
              marginTop: 0,
              overflow: 'hidden'
            }}
          >
            <Image source={{ uri: data.avatar }} style={[styles.image]} />
          </View>
          <View>
            <HTMLView
              content={data.display_name}
              pTagStyle={{ color: color.contrastColor, fontWeight: 'bold' }}
            />
            <Text style={{ color: color.contrastColor }}>
              @{data.username}@{data.domain}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
  }

  exchangeAccount = data => {
    Promise.all([
      save('access_token', data.access_token),
      save('domain', data.domain),
      save('account', data)
    ]).then(() => {
      RNRestart.Restart()
    })
  }

  render() {
    const state = this.state
    color = themeData[mobx.theme]

    return (
      <View style={[styles.main, { backgroundColor: color.themeColor }]}>
        <ImageBackground source={{ uri: state.header }} style={styles.bg}>
          <View style={styles.infoBox}>
            <TouchableOpacity
              style={{
                ...styles.image,
                overflow: 'hidden'
              }}
              activeOpacity={0.5}
              onPress={() => {
                this.props.navigation.navigate('Profile', {
                  id: state.id
                })
              }}
            >
              <Image source={{ uri: state.avatar }} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.info}>
              <HTMLView
                content={state.display_name}
                pTagStyle={{ color: color.white, fontWeight: 'bold' }}
              />
              <Text style={{ color: color.white }}>
                @{state.username}@{state.domain}
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                right: 10,
                top: 20,
                flexDirection: 'row'
              }}
            >
              {this.getOtherAccount()}
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                position: 'absolute',
                right: 20,
                bottom: -20,
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30
              }}
              onPress={() =>
                this.setState({
                  showMultiAccount: !state.showMultiAccount
                })
              }
            >
              <Icon
                name={state.showMultiAccount ? 'caret-up' : 'caret-down'}
                style={[
                  styles.icon,
                  {
                    color: color.lightThemeColor
                  }
                ]}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        {state.showMultiAccount ? (
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {this.getOtherAccountList()}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10
              }}
              onPress={() => {
                this.props.navigation.navigate('Login', {
                  canBack: true
                })
              }}
            >
              <View
                style={[
                  {
                    width: 50,
                    marginHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }
                ]}
              >
                <Icon
                  name="plus"
                  style={[styles.icon, { color: color.contrastColor }]}
                />
              </View>
              <Text style={{ color: color.contrastColor }}>
                添加新的 Mastodon 账号
              </Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.list}>
              <View style={styles.iconBox}>
                <Icon
                  name="envelope"
                  style={[styles.icon, { color: color.contrastColor }]}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('Envelope')
                }}
              >
                <Text style={[styles.text, { color: color.contrastColor }]}>
                  私信
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.list}>
              <View style={styles.iconBox}>
                <Icon
                  name="ban"
                  style={[styles.icon, { color: color.contrastColor }]}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('BlockedUsers')
                }}
              >
                <Text style={[styles.text, { color: color.contrastColor }]}>
                  被屏蔽用户
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.list}>
              <View style={styles.iconBox}>
                <Icon
                  name="bell-slash"
                  style={[styles.icon, { color: color.contrastColor }]}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('MutedUsers')
                }}
              >
                <Text style={[styles.text, { color: color.contrastColor }]}>
                  被隐藏用户
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.list}>
              <View style={styles.iconBox}>
                <Icon
                  name="users"
                  style={[styles.icon, { color: color.contrastColor }]}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('FollowRequestList')
                }}
              >
                <Text style={[styles.text, { color: color.contrastColor }]}>
                  请求关注列表
                </Text>
              </TouchableOpacity>
            </View>
            <Divider style={{ marginTop: 5, marginBottom: 20 }} />
            <View style={styles.list}>
              <View style={styles.iconBox}>
                <Icon
                  name="book"
                  style={[styles.icon, { color: color.contrastColor }]}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('Profile', {
                    id: '81232'
                  })
                }}
              >
                <Text style={[styles.text, { color: color.contrastColor }]}>
                  官方账号
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.list}>
              <View style={styles.iconBox}>
                <Icon
                  name="exclamation-circle"
                  style={[styles.icon, { color: color.contrastColor }]}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('About')
                }}
              >
                <Text style={[styles.text, { color: color.contrastColor }]}>
                  关于
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.list}>
              <View style={styles.iconBox}>
                <Icon
                  name="sign-out-alt"
                  style={[styles.icon, { color: color.contrastColor }]}
                />
              </View>
              <TouchableOpacity activeOpacity={0.5} onPress={this.signout}>
                <Text style={[styles.text, { color: color.contrastColor }]}>
                  退出登录
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
        <View
          style={{
            position: 'absolute',
            left: 25,
            bottom: 15,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            activeOpacity={0.5}
            onPress={() => {
              this.props.navigation.navigate('Setting')
            }}
          >
            <Icon
              name="cog"
              style={{
                color: color.contrastColor,
                fontSize: 18,
                marginBottom: 10
              }}
            />
            <Text
              style={{
                color: color.contrastColor,
                fontSize: 15,
                fontWeight: 'bold'
              }}
            >
              设置
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: 'center', marginHorizontal: 20 }}
            activeOpacity={0.5}
            onPress={() => {
              const theme = mobx.theme === 'white' ? 'black' : 'white'
              mobx.updateTheme(theme)
              save('theme', theme).then(() => {
                RNRestart.Restart()
              })
            }}
          >
            {mobx.theme === 'white' ? (
              <Icon
                name={'moon'}
                style={{
                  color: color.contrastColor,
                  fontSize: 18,
                  marginBottom: 10
                }}
              />
            ) : (
              <Image
                style={{
                  width: 20,
                  height: 20,
                  marginBottom: 10
                }}
                source={require('../assets/image/sun.png')}
              />
            )}
            <Text
              style={{
                color: color.contrastColor,
                fontSize: 15,
                fontWeight: 'bold'
              }}
            >
              {mobx.theme === 'white' ? '夜间' : '白天'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  bg: {
    width: '100%',
    height: 150
  },
  infoBox: {
    height: 120,
    padding: 15
  },
  info: {
    marginTop: 30
  },
  body: {
    paddingTop: 10,
    flex: 1,
    flexDirection: 'column',
    marginTop: 20
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
  iconBox: {
    width: 40,
    marginRight: 20,
    marginLeft: 10,
    alignItems: 'center'
  },
  icon: {
    fontSize: 23
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50
  },
  themeList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: -5
  },
  themeListText: {
    marginLeft: 30,
    fontSize: 18
  }
})
