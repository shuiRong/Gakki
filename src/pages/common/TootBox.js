import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Clipboard
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {
  favourite,
  reblog,
  deleteStatuses,
  setPin,
  muteAccount,
  blockAccount
} from '../../utils/api'
import momentTimezone from 'moment-timezone'
import HTML from 'react-native-render-html'
import jstz from 'jstz'
import { RelativeTime } from 'relative-time-react-native-component'
import { zh } from '../../utils/locale'
import MediaBox from './MediaBox'
import { color } from '../../utils/color'
import { Menu } from 'teaset'
import mobx from '../../utils/mobx'

class TootContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hide: true // CW模式隐藏敏感内容
    }
  }

  componentDidMount() {
    this.setState({
      hide: this.props.data.sensitive
    })
  }

  getHTML = () => {
    if (this.state.hide) {
      return null
    }
    return (
      <HTML
        html={this.props.data.content}
        tagsStyles={tagsStyles}
        imagesMaxWidth={Dimensions.get('window').width}
      />
    )
  }

  render() {
    const toot = this.props.data
    const hide = this.state.hide
    if (!toot.sensitive) return this.getHTML()
    return (
      <View>
        <View>
          <Text style={{ color: color.pColor, fontSize: 16 }}>
            {toot.spoiler_text}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: color.lightBlack,
              width: 75,
              borderRadius: 3,
              padding: 5,
              paddingTop: 3,
              paddingBottom: 3,
              margin: 3,
              marginLeft: 0
            }}
            onPress={() => this.setState({ hide: !hide })}
          >
            <Text
              style={{
                color: color.white,
                textAlign: 'center'
              }}
            >
              {hide ? '显示内容' : '隐藏内容'}
            </Text>
          </TouchableOpacity>
          {this.getHTML()}
        </View>
      </View>
    )
  }
}

export default class TootBox extends Component {
  static defaultProps = {
    showTread: true // 是否显示'显示前文字符'
  }

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
   * @param {favourited}: 应该点赞？
   */
  favourite = (id, favourited) => {
    favourite(id, favourited).then(() => {
      const toot = this.state.toot
      this.setState({
        toot: {
          ...toot,
          favourited: favourited,
          favourites_count: favourited
            ? toot.favourites_count + 1
            : toot.favourites_count - 1
        }
      })
    })
  }

  /**
   * @description 转发toot
   * @param {id}: id
   * @param {reblogged}: 转发状态
   */
  reblog = (id, reblogged) => {
    reblog(id, reblogged).then(() => {
      const toot = this.state.toot
      this.setState({
        toot: {
          ...toot,
          reblogged: reblogged,
          reblogs_count: reblogged
            ? toot.reblogs_count + 1
            : toot.reblogs_count - 1
        }
      })
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
        onPress: () => alert('分享功能正在实现哦～')
      },
      {
        title: getTitle('复制链接'),
        icon: getIcon('share-alt'),
        onPress: this.copyLink
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
        onPress: this.muteAccount
      },
      {
        title: getTitle('屏蔽'),
        icon: getIcon('lock'),
        onPress: this.blockAccount
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

  muteAccount = () => {
    const accountId = this.state.toot.account.id
    muteAccount(accountId, true).then(() => {
      this.props.muteAccount && this.props.muteAccount(accountId)
    })
  }

  blockAccount = () => {
    const accountId = this.state.toot.account.id
    blockAccount(accountId, true).then(() => {
      this.props.blockAccount && this.props.blockAccount(accountId)
    })
  }

  copyLink = () => {
    Clipboard.setString(this.state.toot.url)
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
   * @param {toot} 嘟文内容
   */
  goTootDetail = toot => {
    if (!this.props) {
      return
    }
    mobx.updateReply({
      reply_to_username: toot.account.username,
      in_reply_to_account_id: toot.account.id,
      in_reply_to_id: toot.id,
      mentions: toot.mentions,
      spoiler_text: toot.spoiler_text,
      cw: false
    })
    this.props.navigation.navigate('TootDetail', {
      data: toot
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

  replyTo = toot => {
    const navigation = this.props.navigation

    mobx.updateReply({
      reply_to_username: toot.account.username,
      in_reply_to_account_id: toot.account.id,
      in_reply_to_id: toot.id,
      mentions: toot.mentions,
      spoiler_text: toot.spoiler_text,
      cw: Boolean(toot.spoiler_text)
    })
    if (navigation.state.routeName !== 'TootDetail') {
      navigation.navigate('TootDetail', {
        data: toot
      })
    }
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
          style={styles.avatarTopLeft}
          source={{ uri: toot.reblog.account.avatar }}
        />
        <Image
          style={styles.avatarBottomRight}
          source={{ uri: toot.account.avatar }}
        />
      </View>
    )
  }

  /**
   * @description 嘟文下方显示‘显示前文’
   * @param {data}: 嘟文数据
   */
  showTread = data => {
    if (!this.props.showTread) {
      // 如果是在toot详情页面，无须显示该字符
      return null
    }
    // 如果不是自己的嘟文
    if (mobx.account.id !== data.account.id) {
      return null
    }
    if (mobx.account.id !== data.in_reply_to_account_id) {
      return null
    }
    return (
      <TouchableOpacity
        style={styles.showTreadButton}
        onPress={() => this.goTootDetail(data)}
      >
        <Text style={styles.showTreadText}>显示前文</Text>
      </TouchableOpacity>
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
            onPress={() => this.goTootDetail(toot)}
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
              <TootContent data={data} />
            </View>
            <MediaBox
              data={data.media_attachments}
              sensitive={data.sensitive}
            />
            {this.showTread(data)}
            <View style={styles.iconBox}>
              <TouchableOpacity
                style={styles.iconParent}
                onPress={() => this.replyTo(data)}
              >
                <Icon style={styles.icon} name="reply" />
                <Text style={styles.bottomText}>{data.replies_count}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconParent}
                onPress={() => this.reblog(data.id, !data.reblogged)}
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
                onPress={() => this.favourite(data.id, !data.favourited)}
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
    color: color.headerBg
  },
  menuIcon: {
    color: color.lightBlack,
    fontSize: 15,
    marginRight: 10
  },
  bottomText: {
    marginLeft: 10
  },
  iconParent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  showTreadText: {
    color: color.grey,
    fontSize: 15,
    textAlign: 'left'
  },
  showTreadButton: {
    marginTop: 5,
    width: 100
  },
  avatarTopLeft: {
    width: 30,
    height: 30,
    borderRadius: 3,
    position: 'absolute',
    top: 0,
    left: 0
  },
  avatarBottomRight: {
    width: 20,
    height: 20,
    borderRadius: 3,
    position: 'absolute',
    right: 0,
    bottom: 0
  }
})
