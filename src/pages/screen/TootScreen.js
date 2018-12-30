/**
 * 个人主页的嘟文信息流
 */

import React, { Component } from 'react'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { Spinner } from 'native-base'
import { getUserStatuses } from '../../utils/api'
import ListFooterComponent from '../common/ListFooterComponent'
import TootBox from '../common/TootBox'

export default class TootScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      loading: true,
      url: 'home'
    }
  }
  componentDidMount() {
    this.getUserStatuses()
    this.getUserPinnedStatuses()
  }

  /**
   * @description 检测其他页面跳转过来的动作，比如发嘟页面跳转过来时可能带有toot数据，塞入数据流中
   * 如果带有一些参数；根据参数更新数据状态
   */
  componentWillReceiveProps({ navigation }) {
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
  getUserStatuses = (cb, params) => {
    getUserStatuses(this.props.navigation.getParam('id'), {
      exclude_replies: true,
      ...params
    }).then(res => {
      // 同时将数据更新到state数据中，刷新视图
      this.setState({
        list: this.state.list.concat(res),
        loading: false
      })
      if (cb) cb()
    })
  }

  getUserPinnedStatuses = () => {
    getUserStatuses(this.props.navigation.getParam('id'), {
      pinned: true
    }).then(res => {
      const newList = res.concat(this.state.list)
      this.setState({
        list: newList,
        loading: false
      })
    })
  }

  refreshHandler = () => {
    this.setState({
      loading: true,
      list: []
    })
    this.getUserStatuses()
  }

  // 滚动到了底部，加载数据
  onEndReached = () => {
    const state = this.state
    this.getUserStatuses(null, { max_id: state.list[state.list.length - 1].id })
  }

  render() {
    if (this.state.loading) {
      return <Spinner style={{ marginTop: 50 }} color="#5067FF" />
    }
    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          showsVerticalScrollIndicator={false}
          data={this.state.list}
          onEndReachedThreshold={0.1}
          onEndReached={this.onEndReached}
          onScroll={this.props.onScroll}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.refreshHandler}
            />
          }
          ListFooterComponent={() => <ListFooterComponent />}
          renderItem={({ item }) => (
            <TootBox data={item} navigation={this.props.navigation} />
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: 'white'
  },
  divider: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderBottomWidth: 0
  }
})
