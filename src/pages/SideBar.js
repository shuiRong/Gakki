import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {
  View,
  Text,
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
import { Radio } from './common/Notice'
import { observer } from 'mobx-react'
import { remove, save } from '../utils/store'

let color = {}
@observer
export default class SideBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      avatar: '',
      header: '',
      host: 'cmx.im',
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
      getCurrentUser().then(res => {
        update(res)
        mobx.updateAccount(res)
      })
    } else {
      update(mobx.account)
    }
  }

  /**
   * @description 展示主题切换弹框
   */
  showTheme = () => {
    const newTheme = {
      black: {
        value: false,
        label: '黑夜'
      },
      white: {
        value: false,
        label: '白天'
      }
    }
    newTheme[mobx.theme].value = true
    Radio.show(
      '切换主题',
      newTheme,
      theme => {
        mobx.updateTheme(theme)
        save('theme', theme)
      },
      { height: 200 }
    )
  }

  // 删除存储的access_token等信息，进入到登录页面
  logout = () => {
    remove('access_token').then(() => {
      this.props.navigation.navigate('Login')
    })
  }

  /**
   * @description 展示嘟文可见范围切换弹框
   */
  showVisibilityRange = () => {
    const visibility = {
      public: {
        value: false,
        label: '公开'
      },
      unlisted: {
        value: false,
        label: '不公开'
      },
      private: {
        value: false,
        label: '仅关注者'
      }
    }
    visibility[mobx.visibility].value = true
    Radio.show(
      '选择可见范围',
      visibility,
      item => {
        mobx.updateVisibility(item)
      },
      { height: 220 }
    )
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
          </View>
        </ImageBackground>
        <View style={styles.body}>
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
                name="user"
                style={[styles.icon, { color: color.contrastColor }]}
              />
            </View>
            <TouchableOpacity activeOpacity={0.5} onPress={this.showTheme}>
              <Text style={[styles.text, { color: color.contrastColor }]}>
                切换主题
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon
                name="list"
                style={[styles.icon, { color: color.contrastColor }]}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={this.showVisibilityRange}
            >
              <Text style={[styles.text, { color: color.contrastColor }]}>
                设置嘟文默认可见范围
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
            <TouchableOpacity activeOpacity={0.5} onPress={this.logout}>
              <Text style={[styles.text, { color: color.contrastColor }]}>
                退出登录
              </Text>
            </TouchableOpacity>
          </View>
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
    height: 120
  },
  infoBox: {
    height: 120,
    padding: 15
  },
  info: {
    marginTop: 10
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
