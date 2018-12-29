/**
 * 个人主页的嘟文信息流
 */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import { getUserStatuses } from '../../utils/api'
import { Spinner } from 'native-base'

let deviceWidth = require('Dimensions').get('window').width
export default class TootScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      loading: true,
      url: 'home',
      baseParams: {}
    }
  }
  componentDidMount() {
    this.getUserMediaStatuses()
    // const newList = []
    // onlyMediaData.forEach(item => {
    //   const mediaList = item.media_attachments
    //   if (!mediaList || mediaList.length === 0) {
    //     return
    //   }
    //   mediaList.forEach(media => {
    //     newList.push({
    //       preview_url: media.preview_url,
    //       id: item.id
    //     })
    //   })
    // })
    // this.setState({
    //   list: newList,
    //   loading: false
    // })
  }

  /**
   * @description 检测其他页面跳转过来的动作，比如发嘟页面跳转过来时可能带有toot数据，塞入数据流中
   * 如果带有一些参数；根据参数更新数据状态
   */
  componentWillReceiveProps({ tab, navigation }) {
    if (!navigation) {
      return
    }
    const params = navigation.getParam('data')

    if (params && params.id) {
      let newList = this.state.list
      if (params.mute) {
        // 如果某人被‘隐藏’，那么首页去除所有该用户的消息
        newList = newList.filter(item => item.account.id !== params.accountId)
        this.setState({
          list: newList
        })
        return
      }
      // 改变某条toot的点赞等状态
      newList = newList.map(item => {
        if (item.id !== params.id) {
          return item
        }
        return {
          ...item,
          reblogs_count: params.reblogs_count,
          favourites_count: params.favourites_count,
          favourited: params.favourited,
          reblogged: params.reblogged
        }
      })

      this.setState({
        list: newList
      })
    }

    const toot = navigation.getParam('newToot')
    if (toot) {
      // 将新toot塞入数据最上方
      const newList = [...this.state.list]
      newList.unshift(toot)

      this.setState({
        list: newList
      })
    }
  }

  /**
   * @description 获取用户发送的toot
   * @param {cb}: 成功后的回调函数
   * @param {params}: 参数
   */
  getUserMediaStatuses = (cb, params) => {
    getUserStatuses(this.props.navigation.getParam('id'), {
      only_media: true,
      ...params
    }).then(res => {
      // 同时将数据更新到state数据中，刷新视图
      const newList = []
      res.forEach(item => {
        const mediaList = item.media_attachments
        if (!mediaList || mediaList.length === 0) {
          return
        }
        mediaList.forEach(media => {
          newList.push({
            preview_url: media.preview_url,
            id: item.id
          })
        })
      })
      this.setState({
        list: this.state.list.concat(newList),
        loading: false
      })
      if (cb) cb()
    })
  }

  refreshHandler = () => {
    this.setState({
      loading: true,
      list: []
    })
    this.fetchTimelines()
  }

  /**
   * @description 给toot点赞，如果已经点过赞就取消点赞
   * @param {id}: id
   * @param {favourited}: 点赞状态
   */
  favourite = (id, favourited) => {
    favourite(id, favourited).then(() => {
      this.update(id, 'favourited', favourited, 'favourites_count')
    })
  }

  /**
   * @description 转发toot
   * @param {id}: id
   * @param {reblogged}: 转发状态
   */
  reblog = (id, reblogged) => {
    reblog(id, reblogged).then(() => {
      this.update(id, 'reblogged', reblogged, 'reblogs_count')
    })
  }

  /**
   * @description 更改前端点赞和转发的状态值，并且增减数量
   * @param {status}: 状态名 favourited/reblogged
   * @param {value}: 状态值 true/false
   * @param {statusCount}: 状态的数量key
   */
  update = (id, status, value, statusCount) => {
    const newList = [...this.state.list]
    newList.forEach(list => {
      if (list.id === id) {
        list[status] = !value
        if (value) {
          list[statusCount] -= 1
        } else {
          list[statusCount] += 1
        }
      }
    })
    this.setState({
      list: newList
    })
  }

  /**
   * 跳转入Toot详情页面
   */
  goTootDetail = id => {
    this.props.navigation.navigate('TootDetail', {
      id: id
    })
  }

  // 滚动到了底部，加载数据
  onEndReached = () => {
    const state = this.state
    this.getUserMediaStatuses(null, {
      max_id: state.list[state.list.length - 1].id
    })
  }

  render() {
    if (this.state.loading) {
      return <Spinner style={{ marginTop: 50 }} color="#5067FF" />
    }
    return (
      <View style={styles.container}>
        <FlatList
          numColumns={3}
          showsVerticalScrollIndicator={false}
          data={this.state.list}
          onEndReachedThreshold={0.4}
          onEndReached={this.onEndReached}
          onScroll={this.props.onScroll}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.refreshHandler}
            />
          }
          ListFooterComponent={() => (
            <View
              style={{
                height: 200,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text>正在加载...</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center'
              }}
              activeOpacity={1}
              onPress={() => this.goTootDetail(item.id)}
            >
              <Image
                style={{
                  width: deviceWidth / 3,
                  height: deviceWidth / 3
                }}
                source={{ uri: item.preview_url }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0
  },
  list: {
    alignItems: 'stretch',
    flex: 1
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 20
  }
})
