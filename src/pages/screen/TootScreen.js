/**
 * 个人主页的嘟文信息流
 */

import React, { Component } from 'react'
import { View, FlatList, RefreshControl } from 'react-native'
import { getUserStatuses } from '../../utils/api'
import ListFooterComponent from '../common/ListFooterComponent'
import TootBox from '../common/TootBox'
import { themeData } from '../../utils/color'
import mobx from '../../utils/mobx'
import Divider from '../common/Divider'
import { TootListSpruce } from '../common/Spruce'
import { observer } from 'mobx-react'

let color = {}
@observer
export default class TootScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pinnedList: [], // 置顶嘟文列表
      list: [],
      loading: true,
      url: 'home'
    }
  }
  componentDidMount() {
    console.log('did___')
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
    const id = this.props.navigation.getParam('id')
    getUserStatuses(id, {
      exclude_replies: false,
      pinned: false,
      ...params
    })
      .then(res => {
        // 手动移除已经被置顶的嘟文
        // P.S. mastodon2.7.0的接口返回的status不存在pinned属性，疑似bug
        // res = res.filter(toot => !toot.pinned)
        res = res.filter(item => !this.isExist(this.state.pinnedList, item))

        // 同时将数据更新到state数据中，刷新视图
        this.setState({
          list: this.state.list.concat(res),
          loading: false
        })
        if (cb) cb()
      })
      .catch(() => {
        this.setState({
          loading: false
        })
      })
  }

  /**
   * @description 判断数据中是否已经包含对应数据
   * @param {data}: 数组
   * @param {item}: 特定数据
   */
  isExist = (data, item) => {
    let result = false
    let done = false
    data.forEach(toot => {
      if (done) return
      if (toot.id === item.id) {
        result = true
        done = true
      }
    })
    return result
  }

  getUserPinnedStatuses = () => {
    getUserStatuses(this.props.navigation.getParam('id'), {
      pinned: true
    })
      .then(res => {
        // const newList = res.concat(this.state.list)
        this.setState(
          {
            pinnedList: res,
            loading: false
          },
          () => {
            this.getUserStatuses()
          }
        )
      })
      .catch(() => {
        this.setState({
          loading: false
        })
      })
  }

  refreshHandler = () => {
    alert(1)
    return
    this.setState({
      loading: true,
      list: []
    })
    this.getUserStatuses()
  }

  // 滚动到了底部，加载数据
  onEndReached = () => {
    const state = this.state
    // P.S. 奇怪的Bug,如果吧state.list.length单独提取成一个length变量，那么就会报错:length of undefined
    const lastToot = state.list[state.list.length - 1]
    if (!lastToot) {
      return
    }
    this.getUserStatuses(null, { max_id: lastToot.id })
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
    const state = this.state
    color = themeData[mobx.theme]

    if (this.state.loading) {
      return <TootListSpruce />
    }
    console.log(1, state.pinnedList.concat(state.list).map(item => item.id))
    return (
      <View
        style={{ flex: 1, paddingTop: 0, backgroundColor: color.themeColor }}
      >
        <FlatList
          ItemSeparatorComponent={() => <Divider />}
          showsVerticalScrollIndicator={false}
          data={state.pinnedList.concat(state.list)}
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
