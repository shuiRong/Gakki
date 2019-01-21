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
import { fetch } from '../utils/store'
import { observer } from 'mobx-react'

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
      emojiObj: {},
      id: '',
      black: false,
      white: true,
      night: false
    }
  }
  componentDidMount() {
    getCurrentUser()
      .then(res => {
        this.setState({
          avatar: res.avatar,
          username: res.username,
          header: res.header,
          display_name: res.display_name,
          id: res.id
        })
        mobx.updateAccount(res)
      })
      .catch(err => {
        alert(JSON.stringify(err.response))
      })

    fetch('emojiObj').then(res => {
      if (!res) {
        return
      }
      this.setState({
        emojiObj: res
      })
    })
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
      newTheme,
      theme => {
        mobx.updateTheme(theme)
      },
      { height: 200 }
    )
  }

  /**
   * @description 展示嘟文可见范围切换弹框
   */
  showVisibilityRange = () => {
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
      newTheme,
      theme => {
        mobx.updateTheme(theme)
      },
      { height: 200 }
    )
  }

  render() {
    const state = this.state
    color = themeData[mobx.theme]

    return (
      <View style={[styles.main, { backgroundColor: color.themeColor }]}>
        <ImageBackground source={{ uri: this.state.header }} style={styles.bg}>
          <View style={styles.infoBox}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
                this.props.navigation.navigate('Profile', {
                  id: state.id
                })
              }
            >
              <Image source={{ uri: this.state.avatar }} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.info}>
              <HTMLView
                data={state.display_name}
                emojiObj={state.emojiObj}
                pTagStyle={{ color: color.themeColor, fontWeight: 'bold' }}
              />
              <Text style={{ color: color.themeColor }}>
                @{this.state.username}@{this.state.host}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.body}>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon
                name="user"
                style={[styles.icon, { color: color.contrastColor }]}
              />
            </View>
            <TouchableOpacity activeOpacity={0.5} onPress={this.showTheme}>
              <Text style={[styles.text, { color: color.contrastColor }]}>
                主题
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon
                name="star"
                style={[styles.icon, { color: color.contrastColor }]}
              />
            </View>
            <Text style={[styles.text, { color: color.contrastColor }]}>
              字体大小
            </Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon
                name="list"
                style={[styles.icon, { color: color.contrastColor }]}
              />
            </View>
            <Text style={[styles.text, { color: color.contrastColor }]}>
              默认嘟文可见范围
            </Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon
                name="cogs"
                style={[styles.icon, { color: color.contrastColor }]}
              />
            </View>
            <Text style={[styles.text, { color: color.contrastColor }]}>
              浏览时隐藏发嘟按钮
            </Text>
          </View>
          <Divider style={{ marginTop: 5, marginBottom: 20 }} />
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon
                name="book"
                style={[styles.icon, { color: color.contrastColor }]}
              />
            </View>
            <Text style={[styles.text, { color: color.contrastColor }]}>
              官方账号
            </Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon
                name="user-cog"
                style={[styles.icon, { color: color.contrastColor }]}
              />
            </View>
            <Text style={[styles.text, { color: color.contrastColor }]}>
              账户设置
            </Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon
                name="exclamation-circle"
                style={[styles.icon, { color: color.contrastColor }]}
              />
            </View>
            <Text style={[styles.text, { color: color.contrastColor }]}>
              关于
            </Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon
                name="sign-out-alt"
                style={[styles.icon, { color: color.contrastColor }]}
              />
            </View>
            <Text style={[styles.text, { color: color.contrastColor }]}>
              退出登录
            </Text>
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
