import React, { Component } from 'react'
import {
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  View
} from 'react-native'
import {
  Left,
  Body,
  Right,
  Button,
  Card,
  CardItem,
  Thumbnail,
  List,
  ListItem
} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { favourite, reblog, mute, deleteStatuses } from '../../utils/api'
import HTML from 'react-native-render-html'
import moment from 'moment'
import RNPopoverMenu from 'react-native-popover-menu'
import globe from '../../utils/store'

/**
 * 评论组件
 */
export default class Context extends Component {
  constructor(props) {
    super(props)
    this.state = {
      context: props.data
    }
  }

  componentWillReceiveProps({ data }) {
    // 更新评论数据
    this.setState({
      context: data
    })
  }

  /**
   * @description 给toot点赞，如果已经点过赞就取消点赞
   */
  favourite = (id, favourited) => {
    favourite(id, favourited).then(() => {
      this.update(id, 'favourited', 'favourites_count')
    })
  }

  /**
   * @description 转发toot
   */
  reblog = (id, reblogged) => {
    reblog(id, reblogged).then(() => {
      this.update(id, 'reblogged', 'reblogs_count')
    })
  }

  /**
   * @description 更改前端点赞和转发的状态值，并且增减数量
   * @param {id}: 评论id
   * @param {status}: 状态名 favourited/reblogged
   * @param {statusCount}: 状态的数量key
   */
  update = (id, status, statusCount) => {
    const newData = [...this.props.data]
    newData.forEach(list => {
      if (list.id === id) {
        list[status] = !list[status]

        if (list[status]) {
          list[statusCount] += 1
        } else {
          list[statusCount] -= 1
        }
      }
    })
    this.setState({
      context: newData
    })
  }

  /**
   * @description 隐藏某人，不看所有动态
   */
  mute = () => {
    mute(item.id, item.muted).then(() => {
      this.goBackWithParam()
    })
  }

  /**
   * @description 回复某人
   * @param {id}: id
   * @param {username}: 用户名
   */
  replyTo = (id, username) => {
    globe.updateReply(id, username)
  }

  /**
   * @description 根据是否是用户的toot来展示不同的菜单
   * @param {id}: 用户id
   * @param {ref}: 元素引用
   */
  renderMenu = (id, ref) => {
    let menus = [{ menus: [{ label: '隐藏' }, { label: '屏蔽' }] }]

    if (id !== globe.account.id) {
      // 如果不是自己的toot
      munus = [
        {
          menus: [{ label: '删除' }, { label: '删除并重新编辑' }]
        }
      ]
    }

    RNPopoverMenu.Show(ref, {
      menus: menus,
      onDone: menuIndex => {
        if (menuIndex === 0) {
          this.mute()
        } else if (menuIndex === 1) {
        }
      },
      onCancel: () => {}
    })
  }

  render() {
    if (!this.props.data.length) {
      return <View />
    }
    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={({ highlighted }) => (
            <View style={styles.divider} />
          )}
          data={this.state.context}
          renderItem={({ item, separators }) => (
            <View style={styles.listItem}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10
                }}
              >
                <Image
                  style={styles.image}
                  source={{ uri: item.account.avatar }}
                />
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
              </View>
              <View>
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
                    onPress={() => this.replyTo(item.id, item.account.username)}
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
                    <TouchableOpacity
                      ref={ref => {
                        this.ref = ref
                      }}
                      onPress={() => {
                        this.renderMenu(item.account.id, this.ref)
                      }}
                    >
                      <Icon name="ellipsis-h" style={styles.icon} />
                    </TouchableOpacity>
                  </Button>
                </View>
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
    flexDirection: 'column',
    borderTopColor: '#ddd',
    borderTopWidth: 1
  },
  listItem: {
    alignItems: 'flex-start',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 20
  },
  right: {
    flexDirection: 'column',
    width: 260
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  smallGrey: {
    color: 'grey'
  },
  titleWidth: {
    width: 170,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  displayName: {
    color: 'black'
  },
  iconBox: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  htmlBox: {
    marginTop: 20,
    marginBottom: 10
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
