/**
 * 私信页面
 */

import React, { Component } from 'react'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { Button } from 'native-base'
import { getConversations } from '../utils/api'
import Icon from 'react-native-vector-icons/FontAwesome5'
import TootBox from './common/TootBox'
import Header from './common/Header'
import Loading from './common/Loading'
import ListFooterComponent from './common/ListFooterComponent'
import { color } from '../utils/color'
import Divider from './common/Divider'

export default class Envelope extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      loading: true
    }
  }
  componentDidMount() {
    this.getConversations()
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
    getConversations(params).then(res => {
      // 同时将数据更新到state数据中，刷新视图
      this.setState({
        list: this.state.list.concat(res),
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

    return (
      <View style={styles.container}>
        <Header
          left={
            <Button transparent>
              <Icon
                style={[styles.icon, { color: color.subColor }]}
                name="arrow-left"
                onPress={() => this.props.navigation.goBack()}
              />
            </Button>
          }
          title={'私信'}
          right={'none'}
        />
        {state.loading ? (
          <Loading />
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
    paddingTop: 0,
    backgroundColor: color.white
  },
  icon: {
    fontSize: 17
  }
})
