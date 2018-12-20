import React, { Component } from 'react'
import {
  Text,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Image
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
import { favourite, reblog, mute } from '../../utils/api'
import HTML from 'react-native-render-html'
import moment from 'moment'
import RNPopoverMenu from 'react-native-popover-menu'

/**
 * 评论组件
 */
export default class Context extends Component {
  constructor(props) {
    super(props)
  }

  /**
   * @description 给toot点赞，如果已经点过赞就取消点赞
   */
  favourite = () => {
    favourite(item.id, item.favourited).then(() => {
      this.update('favourited', 'favourites_count')
    })
  }

  /**
   * @description 转发toot
   */
  reblog = () => {
    reblog(item.id, item.reblogged).then(() => {
      this.update('reblogged', 'reblogs_count')
    })
  }

  /**
   * @description 更改前端点赞和转发的状态值，并且增减数量
   * @param {status}: 状态名 favourited/reblogged
   * @param {statusCount}: 状态的数量key
   */
  update = (status, statusCount) => {
    const value = item[status]
    const newToot = { ...item }
    newToot[status] = !value
    if (value) {
      newToot[statusCount] -= 1
    } else {
      newToot[statusCount] += 1
    }
    this.setState({
      toot: newToot
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

  renderMenu = ref => {
    let menus = [
      {
        menus: [{ label: '隐藏' }, { label: '屏蔽' }]
      }
    ]

    RNPopoverMenu.Show(ref, {
      menus: menus,
      onDone: (sectionSelection, menuIndex) => {
        if (menuIndex === 0) {
          this.mute()
        } else if (menuIndex === 1) {
        }
      },
      onCancel: () => {}
    })
  }

  render() {
    if (!this.props.data) {
      return <Text>没有传入评论数据</Text>
    }
    return (
      <View style={styles.container}>
        <List
          dataArray={this.props.data}
          renderRow={item => (
            <ListItem
              avatar
              style={styles.listItem}
              key={item.id}
              button={true}
              onPress={() => this.goTootDetail(item.id)}
            >
              <View>
                <Image
                  style={styles.image}
                  source={{ uri: item.account.avatar }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  marginLeft: 10
                }}
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
                    onPress={() =>
                      this.props.navigation.navigate('Reply', {
                        id: item.id
                      })
                    }
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
              </View>
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
    flex: 1,
    flexDirection: 'column',
    borderTopColor: '#ddd',
    borderTopWidth: 1
  },
  listItem: {
    marginLeft: 0,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    padding: 10,
    alignItems: 'flex-start'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50
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
    justifyContent: 'space-between',
    marginRight: 20
  },
  htmlBox: {
    flex: 1,
    marginTop: 10
  },
  icon: {
    fontSize: 15
  },
  bottomText: {
    marginLeft: 10
  }
})
