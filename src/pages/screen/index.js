/**
 * 本站信息流
 */

import React, { Component } from 'react'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { TootListSpruce } from '../common/Spruce'
import { getHomeTimelines } from '../../utils/api'
import TootBox from '../common/TootBox/Index'
import Divider from '../common/Divider'
import Empty from '../common/Empty'
import PropTypes from 'prop-types'
import mobx from '../../utils/mobx'
import { CancelToken } from 'axios'

export default class LocalScreen extends Component {
  static propTypes = {
    params: PropTypes.object,
    navigation: PropTypes.object.isRequired,
    onScroll: PropTypes.func.isRequired,
    spruce: PropTypes.element,
    url: PropTypes.string,
    index: PropTypes.number.isRequired
  }

  static defaultProps = {
    params: {},
    url: 'public',
    spruce: <TootListSpruce />
  }

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      loading: true
    }
    this.cancel = null
  }
  componentDidMount() {
    this.fetchTimelines()
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

  /**
   * @description 获取时间线数据
   * @param {cb}: 成功后的回调函数
   * @param {params}: 分页参数
   */
  fetchTimelines = (cb, params) => {
    getHomeTimelines(
      mobx.domain,
      this.props.url,
      {
        ...params,
        ...this.props.params
      },
      {
        cancelToken: new CancelToken(c => (this.cancel = c))
      }
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
    this.fetchTimelines()
  }

  // 滚动到了底部，加载数据
  onEndReached = () => {
    const state = this.state
    this.fetchTimelines(null, { max_id: state.list[state.list.length - 1].id })
  }

  render() {
    const state = this.state

    if (state.loading) {
      return <TootListSpruce />
    }
    return (
      <FlatList
        ref={ref => mobx.updateHomeTabRef(ref, this.props.index)}
        ItemSeparatorComponent={() => <Divider />}
        showsVerticalScrollIndicator={false}
        data={state.list}
        onEndReachedThreshold={0.3}
        onEndReached={this.onEndReached}
        onScroll={this.props.onScroll}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={state.loading}
            onRefresh={this.refreshHandler}
          />
        }
        ListEmptyComponent={<Empty />}
        renderItem={({ item }) => (
          <TootBox
            data={item}
            navigation={this.props.navigation}
            deleteToot={this.deleteToot}
            muteAccount={this.muteAccount}
            blockAccount={this.blockAccount}
          />
        )}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0
  }
})
