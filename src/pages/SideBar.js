import React, { Component } from 'react'
import { Icon } from 'native-base'
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native'

import { getCurrentUser } from '../utils/api'

export default class SideBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: 'shuiRong',
      avatar:
        'https://cmx.im/system/accounts/avatars/000/081/232/original/6fde03bb798bd111.jpg?1544620479',
      header:
        'https://cmx.im/system/accounts/headers/000/081/232/original/f6d371ea63e221e1.jpeg?1544620479',
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
      })
      .catch(err => {
        alert(JSON.stringify(err))
      })
  }
  render() {
    return (
      <View style={styles.main}>
        <ImageBackground source={{ uri: this.state.header }} style={styles.bg}>
          <View style={styles.infoBox}>
            <Image
              source={{ uri: this.state.avatar }}
              style={{ height: 50, width: 50, borderRadius: 50 }}
            />
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
            <Icon name="md-person" style={styles.icon} />
            <Text style={styles.text}>编辑个人资料</Text>
          </View>
          <View style={styles.list}>
            <Icon name="md-star" style={styles.icon} />
            <Text style={styles.text}>我的收藏</Text>
          </View>
          <View style={styles.list}>
            <Icon name="md-list" style={styles.icon} />
            <Text style={styles.text}>列表</Text>
          </View>
          <View style={styles.list}>
            <Icon name="book" style={styles.icon} />
            <Text style={styles.text}>草稿</Text>
          </View>
          <View style={styles.list}>
            <Icon name="settings-box" style={styles.icon} />
            <Text style={styles.text}>账户设置</Text>
          </View>
          <View style={styles.list}>
            <Icon name="md-settings" style={styles.icon} />
            <Text style={styles.text}>设置</Text>
          </View>
          <View style={styles.list}>
            <Icon name="md-bookmarks" style={styles.icon} />
            <Text style={styles.text}>关于</Text>
          </View>
          <View style={styles.list}>
            <Icon name="logout" style={styles.icon} />
            <Text style={styles.text}>退出登录</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
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
  icon: {
    marginRight: 30,
    marginLeft: 10,
    color: '#686868',
    fontSize: 25
  },
  text: {
    color: '#3d3d3d',
    fontWeight: 'bold',
    fontSize: 15
  },
  name: {
    color: '#fff',
    fontWeight: 'bold'
  },
  domain: {
    color: '#fff'
  }
})
