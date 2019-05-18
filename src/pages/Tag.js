/**
 * 关注请求列表页面
 */

import React, { Component } from 'react'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { Button } from 'native-base'
import { getTag } from '../utils/api'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Header from './common/Header'
import Loading from './common/Loading'
import ListFooterComponent from './common/ListFooterComponent'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import Divider from './common/Divider'
import TootBox from './common/TootBox/Index'
import { observer } from 'mobx-react'
import { CancelToken } from 'axios'

let color = {}
@observer
export default class HashTag extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      loading: true
    }

    this.cancel = null
  }
  componentDidMount() {
    this.tag = this.props.navigation.getParam('id')
    this.getTag()
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

  getTag = params => {
    getTag(mobx.domain, this.tag, params, {
      cancelToken: new CancelToken(c => (this.cancel = c))
    })
      .then(res => {
        this.setState({
          list: this.state.list.concat(res),
          loading: false
        })
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
    this.getTag()
  }

  // 滚动到了底部，加载数据
  onEndReached = () => {
    const state = this.state
    this.getTag({ max_id: state.list[state.list.length - 1].id })
  }

  render() {
    const state = this.state
    color = themeData[mobx.theme]

    return (
      <View style={[styles.container, { backgroundColor: color.themeColor }]}>
        <Header
          left={
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon
                style={[styles.icon, { color: color.subColor }]}
                name={'arrow-left'}
              />
            </Button>
          }
          title={this.tag ? '#' + this.tag : '标签'}
          right={'none'}
        />
        {state.loading ? (
          <Loading />
        ) : (
          <FlatList
            ItemSeparatorComponent={() => <Divider />}
            ListFooterComponent={() => <ListFooterComponent />}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.3}
            onEndReached={this.onEndReached}
            data={state.list}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={state.loading}
                onRefresh={this.refreshHandler}
              />
            }
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
