/**
 * 跨站信息流
 */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import { Button, Spinner } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { getHomeTimelines, favourite, reblog } from '../../utils/api'
import momentTimezone from 'moment-timezone'
import HTML from 'react-native-render-html'
import jstz from 'jstz'
import { RelativeTime } from 'relative-time-react-native-component'
import { zh } from '../../utils/locale'
import { Label } from 'teaset'
import MediaBox from '../common/MediaBox'

export default class PublicScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      loading: true,
      timezone: jstz.determine().name(), // 获得当前用户所在的时区
      locale: zh,
      url: 'public',
      baseParams: { only_media: false }
    }
  }
  componentDidMount() {
    this.fetchTimelines()
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
   * @description 获取时间线数据
   * @param {cb}: 成功后的回调函数
   * @param {params}: 分页参数
   */
  fetchTimelines = (cb, params) => {
    getHomeTimelines(this.state.url, {
      ...this.state.baseParams,
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
    if (!this.props) {
      return
    }
    this.props.navigation.navigate('TootDetail', {
      id: id
    })
  }

  /**
   * @description 跳转入个人详情页面
   * @param {id}: id
   */
  goProfile = id => {
    if (!this.props) {
      return
    }
    this.props.navigation.navigate('Profile', {
      id: id
    })
  }

  // 滚动到了底部，加载数据
  onEndReached = () => {
    const state = this.state
    this.fetchTimelines(null, { max_id: state.list[state.list.length - 1].id })
  }

  getTimeValue = time => {
    return new Date(
      momentTimezone(time)
        .tz(this.state.timezone)
        .format()
    ).valueOf()
  }

  render() {
    if (this.state.loading) {
      return <Spinner style={{ marginTop: 250 }} color="#5067FF" />
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
          ListFooterComponent={() => (
            <View
              style={{
                height: 100,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text>正在加载...</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                margin: 10,
                marginTop: 15
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.goProfile(item.account.id)}
              >
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 5,
                    marginRight: 10
                  }}
                  source={{ uri: item.account.avatar }}
                />
              </TouchableOpacity>
              <View style={styles.list}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.goTootDetail(item.id)}
                >
                  <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.titleWidth}>
                      <Text style={styles.displayName}>
                        {item.account.display_name || item.account.username}
                      </Text>
                      <Text style={styles.smallGrey}>
                        &nbsp;@{item.account.username}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        textAlign: 'right'
                      }}
                    >
                      <RelativeTime
                        locale={this.state.locale}
                        time={this.getTimeValue(item.created_at)}
                      />
                    </Text>
                  </View>
                  <View style={styles.htmlBox}>
                    <HTML
                      html={item.content}
                      tagsStyles={tagsStyles}
                      imagesMaxWidth={Dimensions.get('window').width}
                    />
                  </View>
                  <MediaBox
                    data={item.media_attachments}
                    sensitive={item.sensitive}
                  />
                  <View style={styles.iconBox}>
                    <Button
                      transparent
                      onPress={() =>
                        this.props.navigation.navigate('Reply', {
                          id: item.id
                        })
                      }
                    >
                      <Icon style={styles.icon} name="reply" />
                      <Text style={styles.bottomText}>
                        {item.replies_count}
                      </Text>
                    </Button>
                    <Button
                      transparent
                      onPress={() => this.reblog(item.id, item.reblogged)}
                    >
                      {item.reblogged ? (
                        <Icon
                          style={{ ...styles.icon, color: '#ca8f04' }}
                          name="retweet"
                        />
                      ) : (
                        <Icon style={styles.icon} name="retweet" />
                      )}
                      <Text style={styles.bottomText}>
                        {item.reblogs_count}
                      </Text>
                    </Button>
                    <Button
                      transparent
                      onPress={() => this.favourite(item.id, item.favourited)}
                    >
                      {item.favourited ? (
                        <Icon
                          style={{ ...styles.icon, color: '#ca8f04' }}
                          name="star"
                          solid
                        />
                      ) : (
                        <Icon style={styles.icon} name="star" />
                      )}
                      <Text style={styles.bottomText}>
                        {item.favourites_count}
                      </Text>
                    </Button>
                    <Button transparent>
                      <Icon style={styles.icon} name="ellipsis-h" />
                    </Button>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    )
  }
}

const tagsStyles = {
  p: {
    color: '#2b2e3d',
    fontSize: 16,
    lineHeight: 20
  },
  a: {
    lineHeight: 20
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: 'white'
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  smallGrey: {
    color: 'grey',
    fontWeight: 'normal'
  },
  titleWidth: {
    width: 170,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  displayName: {
    color: '#333'
  },
  iconBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flex: 1
  },
  htmlBox: {
    flex: 1,
    marginTop: 10,
    marginRight: 20
  },
  icon: {
    fontSize: 15
  },
  bottomText: {
    marginLeft: 10
  },
  divider: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderBottomWidth: 0
  }
})
