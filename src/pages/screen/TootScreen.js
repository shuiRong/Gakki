/**
 * 个人主页的嘟文信息流
 */

import React, { Component } from 'react'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { Spinner } from 'native-base'
import { getUserStatuses } from '../../utils/api'
import ListFooterComponent from '../common/ListFooterComponent'
import TootBox from '../common/TootBox'
import { color } from '../../utils/color'
import Divider from '../common/Divider'

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
      // 手动移除已经被置顶的嘟文
      res = res.filter(toot => !toot.pinned)
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

  deleteToot = id => {
    this.setState({
      list: this.state.list.filter(toot => toot.id !== id)
    })
  }

  // 清空列表中刚被mute的人的所有消息
  muteAccount = id => {
    this.setState({
      list: this.state.list.filter(toot => toot.account.id !== id)
    })
  }

  // 清空列表中刚被mute的人的所有消息
  blockAccount = id => {
    this.setState({
      list: this.state.list.filter(toot => toot.account.id !== id)
    })
  }

  // 修改嘟文的置顶状态
  setPin = (id, pinned) => {
    let newList = [...this.state.list]
    const index = newList.findIndex(toot => toot.id === id)
    if (index < 0) {
      return
    }
    const theToot = newList.splice(index, 1)[0]

    if (pinned) {
      // 找到第一个未置顶的toot的下标
      const firstUnPinnedIndex = newList.findIndex(toot => !toot.pinned)
      newList.splice(firstUnPinnedIndex, 0, theToot)
    } else {
      newList.unshift(theToot)
    }
    this.setState({
      list: newList
    })
  }

  render() {
    if (this.state.loading) {
      return <Spinner style={{ marginTop: 50 }} color={color.headerBg} />
    }
    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={() => <Divider />}
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
            <TootBox
              data={item}
              navigation={this.props.navigation}
              deleteToot={this.deleteToot}
              setPin={this.setPin}
              muteAccount={this.muteAccount}
              blockAccount={this.blockAccount}
            />
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
    backgroundColor: color.white
  }
})
