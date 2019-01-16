import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Button
} from 'react-native'
import { getCurrentUser } from '../utils/api'
import mobx from '../utils/mobx'
import { color } from '../utils/color'
import HTMLView from './common/HTMLView'
import Divider from './common/Divider'
import { fetch } from '../utils/store'
import { Overlay } from 'teaset'

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
      id: ''
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

  showTheme = () => {
    let overlayView = (
      <Overlay.View
        style={{ alignItems: 'center', justifyContent: 'center' }}
        modal={true}
        overlayOpacity={0.5}
        ref={v => (this.overlayView = v)}
      >
        <View
          style={{
            backgroundColor: color.white,
            padding: 20,
            width: '85%',
            height: 180,
            borderRadius: 5,
            alignItems: 'center'
          }}
        >
          <View
            style={{
              alignSelf: 'flex-start'
            }}
          >
            <Text style={{ fontSize: 18, color: color.moreBlack }}>
              应用主题
            </Text>
            <View />
          </View>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end'
            }}
            onPress={() => this.overlayView && this.overlayView.close()}
            activeOpacity={0.5}
          >
            <Text>取消</Text>
          </TouchableOpacity>
        </View>
      </Overlay.View>
    )
    Overlay.show(overlayView)
  }

  render() {
    const state = this.state
    return (
      <View style={styles.main}>
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
                pTagStyle={{ color: color.white, fontWeight: 'bold' }}
              />
              <Text style={styles.domain}>
                @{this.state.username}@{this.state.host}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.body}>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon name="user" style={styles.icon} />
            </View>
            <TouchableOpacity activeOpacity={0.5} onPress={this.showTheme}>
              <Text style={styles.text}>主题</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon name="star" style={styles.icon} />
            </View>
            <Text style={styles.text}>字体大小</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon name="list" style={styles.icon} />
            </View>
            <Text style={styles.text}>默认嘟文可见范围</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon name="cogs" style={styles.icon} />
            </View>
            <Text style={styles.text}>浏览时隐藏发嘟按钮</Text>
          </View>
          <Divider style={{ marginTop: 5, marginBottom: 20 }} />
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon name="book" style={styles.icon} />
            </View>
            <Text style={styles.text}>官方账号</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon name="user-cog" style={styles.icon} />
            </View>
            <Text style={styles.text}>账户设置</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon name="exclamation-circle" style={styles.icon} />
            </View>
            <Text style={styles.text}>关于</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon name="sign-out-alt" style={styles.icon} />
            </View>
            <Text style={styles.text}>退出登录</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: color.white,
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
    color: color.lightBlack,
    fontSize: 23
  },
  text: {
    color: color.moreBlack,
    fontWeight: 'bold',
    fontSize: 15
  },
  name: {
    color: color.lightGrey,
    fontWeight: 'bold'
  },
  domain: {
    color: color.lightGrey
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50
  }
})
