import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native'
import { getCurrentUser } from '../utils/api'
import globe from '../utils/mobx'
import { color } from '../utils/color'

export default class SideBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: 'shuiRong',
      avatar: '',
      header: '',
      host: 'cmx.im'
    }
  }
  componentDidMount() {
    getCurrentUser()
      .then(res => {
        this.setState({
          avatar: res.avatar,
          username: res.username,
          header: res.header
        })
        globe.updateAccount(res)
      })
      .catch(err => {
        alert(JSON.stringify(err.response))
      })
  }
  render() {
    return (
      <View style={styles.main}>
        <ImageBackground source={{ uri: this.state.header }} style={styles.bg}>
          <View style={styles.infoBox}>
            <Image source={{ uri: this.state.avatar }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{this.state.username}</Text>
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
            <Text style={styles.text}>编辑个人资料</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon name="star" style={styles.icon} />
            </View>
            <Text style={styles.text}>我的收藏</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon name="list" style={styles.icon} />
            </View>
            <Text style={styles.text}>列表</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon name="book" style={styles.icon} />
            </View>
            <Text style={styles.text}>草稿</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon name="user-cog" style={styles.icon} />
            </View>
            <Text style={styles.text}>账户设置</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.iconBox}>
              <Icon name="cogs" style={styles.icon} />
            </View>
            <Text style={styles.text}>设置</Text>
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
    backgroundColor: color.lightGrey,
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
    padding: 10,
    flex: 1,
    flexDirection: 'column',
    marginTop: 20
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
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
