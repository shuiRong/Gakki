/**
 * 个人主页的嘟文信息流
 */

import React, { Component } from 'react'
import { FlatList } from 'react-native'
import { getUserStatuses } from '../../utils/api'
import ListFooterComponent from '../common/ListFooterComponent'
import TootBox from '../common/TootBox/Index'
import { themeData } from '../../utils/color'
import mobx from '../../utils/mobx'
import Divider from '../common/Divider'
import { TootListSpruce } from '../common/Spruce'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { CancelToken } from 'axios'

@observer
export default class ProfileTab extends Component {
  static propTypes = {
    params: PropTypes.object,
    navigation: PropTypes.object.isRequired,
    onScroll: PropTypes.func.isRequired,
    spruce: PropTypes.element,
    style: PropTypes.object
  }

  static defaultProps = {
    params: {},
    style: {},
    spruce: <TootListSpruce />
  }

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      loading: true,
      url: 'home'
    }

    this.cancel = null
  }
  componentDidMount() {
    this.getUserStatuses()
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

  componentWillUnmount() {
    this.cancel && this.cancel()
  }

  /**
   * @description 获取用户发送的toot
   * @param {cb}: 成功后的回调函数
   */
  getUserStatuses = (cb, params) => {
    const id = this.props.navigation.getParam('id')
    getUserStatuses(
      mobx.domain,
      id,
      {
        exclude_replies: false,
        pinned: true,
        ...params,
        ...this.props.params
      },
      { cancelToken: new CancelToken(c => (this.cancel = c)) }
    )
      .then(res => {
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
    return (
      <FlatList
        contentContainerStyle={{ paddingTop: 500, ...this.props.style }}
        ItemSeparatorComponent={() => <Divider />}
        showsVerticalScrollIndicator={false}
        data={state.list}
        onEndReachedThreshold={0.3}
        onEndReached={this.onEndReached}
        onScroll={this.props.onScroll}
        keyExtractor={item => item.id}
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
    )
  }
}
