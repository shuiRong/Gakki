/**
 * 关注请求列表页面
 */

import React, { Component } from 'react'
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native'
import { Button } from 'native-base'
import { followRequests } from '../utils/api'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Header from './common/Header'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import Divider from './common/Divider'
import Empty from './common/Empty'
import UserItem from './common/UserItem'
import { observer } from 'mobx-react'
import { UserSpruce } from './common/Spruce'
import { CancelToken } from 'axios'

let color = {}
@observer
export default class FollowRequests extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      loading: true
    }

    this.cancel = null
  }
  componentDidMount() {
    this.followRequests()
  }

  componentWillUnmount() {
    this.cancel && this.cancel()
  }

  /**
   * @description 获取关注请求列表
   */
  followRequests = () => {
    followRequests(mobx.domain, {
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

  deleteUser = id => {
    this.setState({
      list: this.state.list.filter(item => item.id !== id)
    })
  }

  refreshHandler = () => {
    this.setState({
      loading: true,
      list: []
    })
    this.followRequests()
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
          title={'关注请求列表'}
          right={'none'}
        />
        {state.loading ? (
          <UserSpruce />
        ) : (
          <FlatList
            ItemSeparatorComponent={() => <Divider />}
            ListFooterComponent={state.list.length ? <Divider /> : <View />}
            ListEmptyComponent={<Empty />}
            showsVerticalScrollIndicator={false}
            data={state.list}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={state.loading}
                onRefresh={this.refreshHandler}
              />
            }
            renderItem={({ item }) => (
              <UserItem
                account={item}
                model={'request'}
                navigation={this.props.navigation}
                deleteUser={this.deleteUser}
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
