import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { favourite, reblog, deleteStatuses, setPin } from '../../utils/api'
import momentTimezone from 'moment-timezone'
import HTML from 'react-native-render-html'
import jstz from 'jstz'
import { RelativeTime } from 'relative-time-react-native-component'
import { zh } from '../../utils/locale'
import MediaBox from './MediaBox'
import { color } from '../../utils/color'
import { Menu } from 'teaset'
import mobx from '../../utils/mobx'

export default class TootBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timezone: jstz.determine().name(), // 获得当前用户所在的时区
      locale: zh,
      toot: null
    }
  }

  componentDidMount() {
    this.setState({
      toot: this.props.data
    })
  }

  componentWillReceiveProps({ data }) {
    this.setState({
      toot: data
    })
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

  showMenu = () => {
    const toot = this.state.toot
    const getTitle = title => (
      <Text style={{ color: color.moreBlack }}>{title}</Text>
    )
    const getIcon = name => <Icon name={name} style={styles.menuIcon} />

    const baseItems = [
      {
        title: getTitle('分享'),
        icon: getIcon('share'),
        onPress: () => alert('Search')
      },
      {
        title: getTitle('复制链接'),
        icon: getIcon('share-alt'),
        onPress: () => alert('Search')
      }
    ]

    const myToot = [
      {
        title: getTitle('删除'),
        icon: getIcon('trash-alt'),
        onPress: this.deleteStatuses
      },
      {
        title: getTitle(toot.pinned ? '取消置顶' : '置顶'),
        icon: getIcon('thumbtack'),
        onPress: this.setPin
      }
    ]

    const theirToot = [
      {
        title: getTitle('隐藏'),
        icon: getIcon('volume-mute'),
        onPress: () => alert('Search')
      },
      {
        title: getTitle('屏蔽'),
        icon: getIcon('lock'),
        onPress: () => alert('Search')
      }
    ]

    this.ref.measureInWindow((x, y, width, height) => {
      let items = baseItems.concat(this.isMine() ? myToot : theirToot)
      Menu.show({ x: x - 20, y, width, height }, items, {
        popoverStyle: {
          backgroundColor: color.white,
          justifyContent: 'center'
        }
      })
    })
  }

  deleteStatuses = () => {
    const id = this.state.toot.id
    deleteStatuses(id).then(() => {
      this.props.deleteToot && this.props.deleteToot(id)
    })
  }

  setPin = () => {
    const toot = this.state.toot
    setPin(toot.id, toot.pinned).then(() => {
      this.setState(
        {
          toot: { ...toot, pinned: !toot.pinned }
        },
        () => {
          this.props.setPin && this.props.setPin(toot.id, toot.pinned)
        }
      )
    })
  }

  /**
   * @description 是否是自己的嘟文
   */

  isMine = () => {
    const account = this.state.toot.account
    const mobxAccount = mobx.account
    return (
      mobxAccount.id === account.id && mobxAccount.username === account.username
    )
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

  getTimeValue = time => {
    return new Date(
      momentTimezone(time)
        .tz(this.state.timezone)
        .format()
    ).valueOf()
  }

  /**
   * @description 获取用户头像，如果是转发，则同时显示两人头像
   * @param {toot}: 包含所有信息的toot数据
   */
  getAvatar = toot => {
    if (!toot.reblog) {
      return (
        <Image style={styles.avatar} source={{ uri: toot.account.avatar }} />
      )
    }

    return (
      <View style={{ width: 40, height: 40, marginRight: 10 }}>
        <Image
          style={{
            width: 30,
            height: 30,
            borderRadius: 3,
            position: 'absolute',
            top: 0,
            left: 0
          }}
          source={{ uri: toot.reblog.account.avatar }}
        />
        <Image
          style={{
            width: 20,
            height: 20,
            borderRadius: 3,
            position: 'absolute',
            right: 0,
            bottom: 0
          }}
          source={{ uri: toot.account.avatar }}
        />
      </View>
    )
  }

  getAdditionalInfo = () => {
    const toot = this.state.toot
    let type = undefined
    const info = {
      reblog: '转嘟了',
      pinned: '置顶嘟文'
    }
    const icon = {
      reblog: 'retweet',
      pinned: 'thumbtack'
    }

    if (toot.reblog) {
      type = 'reblog'
    } else if (toot.pinned) {
      type = 'pinned'
    }

    if (type === undefined) {
      return type
    }

    return (
      <View style={styles.additional}>
        <Icon name={icon[type]} style={[styles.additionalIcon]} />
        <Text style={styles.additionalName}>
          {toot.account.display_name || toot.account.username}
        </Text>
        <Text style={styles.additionalTypeInfo}>{info[type]}</Text>
      </View>
    )
  }

  getBody = toot => {
    const data = toot.reblog || toot

    return (
      <View style={styles.body}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.goProfile(data.account.id)}
        >
          {this.getAvatar(toot)}
        </TouchableOpacity>
        <View style={styles.list}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.goTootDetail(data.id)}
          >
            <View style={styles.row}>
              <Text numberOfLines={1} style={styles.titleWidth}>
                <Text style={styles.displayName}>
                  {data.account.display_name || data.account.username}
                </Text>
                <Text style={styles.smallGrey}>
                  &nbsp;@{data.account.username}
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
                  time={this.getTimeValue(data.created_at)}
                />
              </Text>
            </View>
            <View style={styles.htmlBox}>
              <HTML
                html={data.content}
                tagsStyles={tagsStyles}
                imagesMaxWidth={Dimensions.get('window').width}
              />
            </View>
            <MediaBox
              data={data.media_attachments}
              sensitive={data.sensitive}
            />
            <View style={styles.iconBox}>
              <TouchableOpacity
                style={styles.iconParent}
                onPress={() =>
                  this.props.navigation.navigate('Reply', {
                    id: data.id
                  })
                }
              >
                <Icon style={styles.icon} name="reply" />
                <Text style={styles.bottomText}>{data.replies_count}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconParent}
                onPress={() => this.reblog(data.id, data.reblogged)}
              >
                {data.reblogged ? (
                  <Icon style={styles.iconColored} name="retweet" />
                ) : (
                  <Icon style={styles.icon} name="retweet" />
                )}
                <Text style={styles.bottomText}>{data.reblogs_count}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconParent}
                onPress={() => this.favourite(data.id, data.favourited)}
              >
                {data.favourited ? (
                  <Icon style={styles.iconColored} name="star" solid />
                ) : (
                  <Icon style={styles.icon} name="star" />
                )}
                <Text style={styles.bottomText}>{data.favourites_count}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconParent}
                ref={ref => (this.ref = ref)}
                onPress={this.showMenu}
              >
                <Icon style={styles.icon} name="ellipsis-h" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const toot = this.state.toot

    if (!toot) {
      return <View />
    }

    return (
      <View style={styles.container}>
        {this.getAdditionalInfo()}
        {this.getBody(toot)}
      </View>
    )
  }
}

const tagsStyles = {
  p: {
    color: color.pColor,
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
    margin: 10,
    marginTop: 15
  },
  additional: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -5
  },
  additionalIcon: {
    width: 40,
    fontSize: 15,
    color: color.lightBlack,
    marginRight: 10,
    textAlign: 'right'
  },
  additionalName: {
    marginRight: 10,
    color: color.lightBlack
  },
  additionalTypeInfo: {
    color: color.lightBlack
  },
  list: {
    alignItems: 'stretch',
    flex: 1
  },
  body: {
    flexDirection: 'row'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  smallGrey: {
    color: color.lightBlack,
    fontWeight: 'normal'
  },
  titleWidth: {
    width: 170,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  displayName: {
    color: color.moreBlack
  },
  iconBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flex: 1,
    width: '90%'
  },
  htmlBox: {
    flex: 1,
    marginTop: 10,
    marginRight: 20
  },
  icon: {
    fontSize: 15
  },
  iconColored: {
    fontSize: 15,
    color: color.moreBlack
  },
  menuIcon: {
    color: '#666666',
    fontSize: 15,
    marginRight: 10
  },
  bottomText: {
    marginLeft: 10
  },
  divider: {
    borderColor: color.lightGrey,
    borderWidth: 1,
    borderBottomWidth: 0
  },
  iconParent: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
