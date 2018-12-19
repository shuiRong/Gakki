/**
 * 主页主体内容
 */

import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, YellowBox, Text } from 'react-native'
import {
  List,
  ListItem,
  Left,
  Body,
  Thumbnail,
  Button,
  Spinner
} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { getHomeTimelines, favourite, reblog } from '../../utils/api'
import moment from 'moment'
import 'moment/locale/zh-cn'
import HTML from 'react-native-render-html'

YellowBox.ignoreWarnings(['Remote debugger'])

export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: undefined,
      loading: false
    }
  }
  componentDidMount() {
    this.fetchTimelines()
  }

  /**
   * @description 获取时间线数据
   * @param {cb}: 成功后的回调函数
   */
  fetchTimelines = cb => {
    this.setState({
      loading: true
    })
    getHomeTimelines(this.props.url, this.props.query).then(res => {
      this.setState({
        list: res,
        loading: false
      })
      if (cb) cb()
    })
  }

  /**
   * @description props变化的钩子函数
   * 如果处于刷新之中，重新加载数据
   * 如果带有一些参数；根据参数更新数据状态
   */
  componentWillReceiveProps({ refreshing, finishRefresh, navigation }) {
    if (refreshing) {
      this.fetchTimelines(finishRefresh)
    }
    if (!navigation) {
      return
    }
    const params = navigation.getParam('data')

    if (params && params.id) {
      let newList = this.state.list
      if (params.muted) {
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

  render() {
    if (this.state.loading) {
      return <Spinner style={{ marginTop: 250 }} color="#5067FF" />
    }
    return (
      <View style={styles.container}>
        <List
          dataArray={this.state.list}
          renderRow={item => (
            <ListItem
              avatar
              style={styles.list}
              key={item.id}
              button={true}
              onPress={() => this.goTootDetail(item.id)}
            >
              <Left>
                <Thumbnail source={{ uri: item.account.avatar }} />
              </Left>
              <Body>
                <View style={styles.row}>
                  <Text numberOfLines={1} style={styles.titleWidth}>
                    <Text style={styles.displayName}>
                      {item.account.display_name || item.account.username}
                    </Text>
                    <Text style={styles.smallGrey}>
                      &nbsp;@{item.account.username}
                    </Text>
                  </Text>
                  <Text>
                    {moment(item.created_at, 'YYYY-MM-DD')
                      .startOf('day')
                      .fromNow()}
                  </Text>
                </View>
                <View style={styles.htmlBox}>
                  <HTML
                    html={item.content}
                    tagsStyles={tagsStyles}
                    imagesMaxWidth={Dimensions.get('window').width}
                  />
                </View>
                <View style={styles.iconBox}>
                  <Button
                    transparent
                    onPress={this.props.navigation.navigate('Reply', {
                      id: item.id
                    })}
                  >
                    <Icon style={styles.icon} name="reply" />
                    <Text style={styles.bottomText}>{item.replies_count}</Text>
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
                    <Text style={styles.bottomText}>{item.reblogs_count}</Text>
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
              </Body>
            </ListItem>
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
    paddingRight: 10,
    flex: 1,
    flexDirection: 'column'
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 20
  },
  list: {
    marginBottom: 10
  },
  right: {
    flexDirection: 'column',
    width: 260
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
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18
  },
  iconBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
    marginTop: 10
  },
  htmlBox: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10
  },
  icon: {
    fontSize: 15
  },
  bottomText: {
    marginLeft: 10
  }
})
