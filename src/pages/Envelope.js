/**
 * 私信页面
 */

import React, { Component } from 'react'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { Button } from 'native-base'
import { getConversations } from '../utils/api'
import Icon from 'react-native-vector-icons/FontAwesome5'
import TootBox from './common/TootBox/Index'
import Header from './common/Header'
import ListFooterComponent from './common/ListFooterComponent'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import Divider from './common/Divider'
import { observer } from 'mobx-react'
import { TootListSpruce } from './common/Spruce'
import { CancelToken } from 'axios'

@observer
export default class Envelope extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      loading: true
    }

    this.cancel = null
  }
  componentDidMount() {
    this.getConversations()
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
  getConversations = (cb, params) => {
    getConversations(mobx.domain, params, {
      cancelToken: new CancelToken(c => (this.cancel = c))
    })
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
    this.getConversations()
  }

  // 滚动到了底部，加载数据
  onEndReached = () => {
    const state = this.state
    this.getConversations(null, {
      max_id: state.list[state.list.length - 1].last_status.id
    })
  }

  render() {
    const state = this.state
    color = themeData[mobx.theme]

    return (
      <View style={[styles.container, { backgroundColor: color.themeColor }]}>
        <Header
          left={
            <Button transparent>
              <Icon
                style={[styles.icon, { color: color.subColor }]}
                name={'arrow-left'}
                onPress={() => this.props.navigation.goBack()}
              />
            </Button>
          }
          title={'私信'}
          right={'none'}
        />
        {state.loading ? (
          <TootListSpruce />
        ) : (
          <FlatList
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
            ListFooterComponent={() => (
              <ListFooterComponent info={'没有更多了...'} />
            )}
            renderItem={({ item }) => (
              <TootBox
                data={{
                  ...item.last_status,
                  accounts: item.accounts
                }}
                navigation={this.props.navigation}
                deleteToot={this.deleteToot}
                muteAccount={this.muteAccount}
                blockAccount={this.blockAccount}
              />
            )}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0
  },
  icon: {
    fontSize: 17
  }
})
