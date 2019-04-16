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
import { remove, save } from '../utils/store'
import CodePush from 'react-native-code-push'

let color = {}
@observer
export default class SideBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      avatar: '',
      header: '',
      host: mobx.domain,
      display_name: '',
      id: '',
      black: false,
      white: true,
      night: false
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
      getCurrentUser(mobx.domain).then(res => {
        update(res)
        mobx.updateAccount(res)
      })
    } else {
      update(mobx.account)
    }
  }

  // 删除存储的access_token等信息，进入到登录页面
  signout = () => {
    remove('access_token').then(() => {
      this.props.navigation.navigate('Login')
    })
  }

  /**
   * @description 获取其他账户头像
   */
  getOtherAccount() {
    const keys = Object.keys(mobx.userData)
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

    return result.map(data => {
      if (!data) return null
      return (
        <TouchableOpacity
          style={{
            ...styles.image,
            height: 35,
            width: 35,
            margin: 5,
            overflow: 'hidden'
          }}
          activeOpacity={0.5}
          onPress={() => {
            Promise.all([
              save('access_token', data.access_token),
              save('domain', data.domain),
              save('account', data)
            ]).then(() => {
              CodePush.restartApp()
            })
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
                data={state.display_name}
                pTagStyle={{ color: color.white, fontWeight: 'bold' }}
              />
              <Text style={{ color: color.white }}>
                @{state.username}@{state.host}
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
          </View>
        </ImageBackground>
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
              save('theme', theme).then(() => {})
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
