import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Clipboard,
  Share
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {
  favourite,
  reblog,
  deleteStatuses,
  setPin as setPinRequest,
  muteAccount as muteAccountRequest,
  blockAccount as blockAccountRequest
} from '../../../utils/api'
import momentTimezone from 'moment-timezone'
import jstz from 'jstz'
import { RelativeTime } from 'relative-time-react-native-component'
import { zh } from '../../../utils/locale'
import Media from '../Media'
import { themeData } from '../../../utils/color'
import { Menu } from 'teaset'
import mobx from '../../../utils/mobx'
import HTMLView from '../HTMLView'
import { CancelToken } from 'axios'
import TootContent from './TootContent'
import Avatar from './Avatar'

const cheerio = require('react-native-cheerio')
const timezone = jstz.determine().name() // 获得当前用户所在的时区
const color = themeData[mobx.theme]

const areEqual = (prevProps, nextProps) => {
  const prevToot = prevProps.data
  const nextToot = nextProps.data

  return (
    prevToot.id === nextToot.id &&
    prevToot.favourited === nextToot.favourited &&
    prevToot.favourites_count === nextToot.favourites_count &&
    prevToot.reblogged === nextToot.reblogged &&
    prevToot.reblogs_count === nextToot.reblogs_count &&
    prevToot.replies_count === nextToot.replies_count
  )
}

/**
 * @description 需要考虑到普通嘟文和通知接口的嘟文两种数据格式
 * @param {showTread}: 是否显示'显示前文字符'
 * @param {isMaster}: 当前的嘟文再详情页面展示时是主要还是次要（主要区别是头像是和用户名展示在一起还是单独一列）
 */
const BodyFunc = ({
  showTread = false,
  isMaster = false,
  data = {},
  deleteToot = () => {},
  setPin = () => {},
  muteAccount = () => {},
  blockAccount = () => {},
  navigation = () => {}
}) => {
  let tempToot = null
  if (data.type) {
    tempToot = data.status || data
  } else {
    tempToot = data.reblog || data
  }
  const [toot, setToot] = useState(tempToot) // 有type属性，表示是Notification entity. 如果数据为空，说明情况是：Notification Entity 中的follow类型
  const isNotificationPage = data.type // 当前组件是否使用在通知页面，因为通知接口返回的数据格式稍有不同

  let pTagStyle = { color: color.contrastColor }

  if (isNotificationPage) {
    pTagStyle = {
      color: color.subColor
    }
  }

  /**
   * @description 给toot点赞，如果已经点过赞就取消点赞
   * @param {id}: id
   * @param {favourited}: 应该点赞？
   */
  const favouriteFunc = (id, favourited) => {
    favourite(mobx.domain, id, favourited, {
      cancelToken: new CancelToken(c => cancel.push(c))
    }).then(res => {
      setToot(res)
    })
  }

  /**
   * 跳转入Toot详情页面
   */
  const goTootDetail = () => {
    mobx.updateReply({
      reply_to_username: toot.account.username,
      in_reply_to_account_id: toot.account.id,
      in_reply_to_id: toot.id,
      mentions: toot.mentions,
      spoiler_text: toot.spoiler_text,
      cw: false
    })
    navigation.navigate('TootDetail', {
      data: toot
    })
  }

  /**
   * @description 跳转入个人详情页面
   */
  const goProfile = () => {
    navigation.navigate('Profile', {
      id: toot.account.id
    })
  }

  const replyTo = () => {
    const navigation = navigation

    mobx.updateReply({
      reply_to_username: toot.account.username,
      in_reply_to_account_id: toot.account.id,
      in_reply_to_id: toot.id,
      mentions: toot.mentions,
      spoiler_text: toot.spoiler_text,
      cw: Boolean(toot.spoiler_text)
    })
    if (navigation.routeName !== 'TootDetail') {
      navigation.navigate('TootDetail', {
        data: toot
      })
    }
  }

  /**
   * @description 删除嘟文
   * @param {recycle}: 是否重新编辑
   */
  const deleteStatusesFunc = (recycle = false) => {
    const id = toot.id
    deleteStatuses(mobx.domain, id, {
      cancelToken: new CancelToken(c => cancel.push(c))
    }).then(() => {
      deleteToot(id, recycle)
    })
  }

  const setPinFunc = () => {
    setPinRequest(mobx.domain, toot.id, toot.pinned, {
      cancelToken: new CancelToken(c => cancel.push(c))
    }).then(() => {
      setToot({ ...toot, pinned: !toot.pinned })
      // 这里可能出现问题
      setPin(toot.id, toot.pinned)
      // setState(
      //   {
      //     toot: { ...toot, pinned: !toot.pinned }
      //   },
      //   () => {
      //     setPin && setPin(toot.id, toot.pinned)
      //   }
      // )
    })
  }

  const muteAccountFunc = () => {
    const accountId = toot.account.id
    muteAccountRequest(mobx.domain, accountId, true, {
      cancelToken: new CancelToken(c => cancel.push(c))
    }).then(() => {
      muteAccount(accountId)
    })
  }

  const blockAccountFunc = () => {
    const accountId = toot.account.id
    blockAccountRequest(mobx.domain, accountId, true, {
      cancelToken: new CancelToken(c => cancel.push(c))
    }).then(() => {
      blockAccount(accountId)
    })
  }

  const copyLink = () => {
    Clipboard.setString(toot.url)
  }

  /**
   * @description 是否是自己的嘟文
   */

  const isMine = () => {
    const account = toot.account
    const mobxAccount = mobx.account
    return (
      mobxAccount.id === account.id && mobxAccount.username === account.username
    )
  }

  const setClipboard = () => {
    Clipboard.setString(cheerio.load(toot.content).text())
  }

  /**
   * @description 返回嘟文底部图标
   */
  const getIcons = () => {
    if (!toot || isNotificationPage === 'follow') {
      return null
    }

    return (
      <View style={styles.iconBox}>
        <TouchableOpacity style={styles.iconParent} onPress={replyTo}>
          <Icon style={{ fontSize: 15, color: color.subColor }} name="reply" />
          <Text style={{ marginLeft: 10, color: color.subColor }}>
            {toot.replies_count}
          </Text>
        </TouchableOpacity>
        {getRetweetIcon()}
        <TouchableOpacity
          style={styles.iconParent}
          onPress={() => favouriteFunc(toot.id, !toot.favourited)}
        >
          {toot.favourited ? (
            <Icon
              style={{ fontSize: 15, color: color.gold }}
              name="star"
              solid
            />
          ) : (
            <Icon style={{ fontSize: 15, color: color.subColor }} name="star" />
          )}
          <Text style={{ marginLeft: 10, color: color.subColor }}>
            {toot.favourites_count}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconParent}
          ref={ref => (ref = ref)}
          onPress={showMenu}
        >
          <Icon
            style={{ fontSize: 15, color: color.subColor }}
            name="ellipsis-h"
          />
        </TouchableOpacity>
      </View>
    )
  }

  /**
   * @description 返回相对时间或者关注好友的按钮
   * @param {toot}: 嘟文数据，也可能是notification entity
   * @param {isNotificationPage}: 是否是通知页
   */
  const getRelativeTimeOrIcon = () => {
    if (!toot || isNotificationPage === 'follow') {
      return null
    }

    return (
      <Text
        style={{
          flex: 1,
          textAlign: 'right',
          color: color.subColor
        }}
      >
        <RelativeTime locale={zh} time={getTimeValue(toot.created_at)} />
      </Text>
    )
  }

  const getTimeValue = time => {
    return new Date(
      momentTimezone(time)
        .tz(timezone)
        .format()
    ).valueOf()
  }

  /**
   * @description 分享到其他应用
   */
  const onShare = () => {
    let uri = toot.uri
    if (/\/activity$/.test(uri)) {
      uri = uri.replace('/activity', '')
    }
    Share.share({
      message: `${cheerio.load(toot.content).text()}\n${uri}`
    })
      .then(result => {
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  const getTitle = title => (
    <Text style={{ color: color.contrastColor }}>{title}</Text>
  )
  const getIcon = name => (
    <Icon name={name} style={[styles.menuIcon, { color: color.subColor }]} />
  )
  const showMenu = () => {
    const baseItems = [
      {
        title: getTitle('分享'),
        icon: getIcon('share'),
        onPress: onShare
      },
      {
        title: getTitle('复制链接'),
        icon: getIcon('share-alt'),
        onPress: copyLink
      },
      {
        title: getTitle('复制嘟文'),
        icon: getIcon('clone'),
        onPress: setClipboard
      }
    ]

    const myToot = [
      {
        title: getTitle('删除'),
        icon: getIcon('trash-alt'),
        onPress: deleteStatusesFunc
      },
      // {
      //   title: getTitle('删除且重新编辑'),
      //   icon: getIcon('recycle'),
      //   onPress: () => deleteStatuses(true)
      // },
      {
        title: getTitle(toot.pinned ? '取消置顶' : '置顶'),
        icon: getIcon('thumbtack'),
        onPress: setPinFunc
      }
    ]

    const theirToot = [
      {
        title: getTitle('隐藏'),
        icon: getIcon('volume-mute'),
        onPress: muteAccountFunc
      },
      {
        title: getTitle('屏蔽'),
        icon: getIcon('lock'),
        onPress: blockAccountFunc
      }
    ]

    ref.measureInWindow((x, y, width, height) => {
      let items = baseItems.concat(isMine() ? myToot : theirToot)
      Menu.show({ x: x - 20, y, width, height }, items, {
        popoverStyle: {
          backgroundColor: color.themeColor,
          justifyContent: 'center',
          elevation: 10,
          borderColor: color.subColor
        }
      })
    })
  }

  /**
   * @description 返回HTML内容前先判断
   * @param {toot}: 嘟文数据
   */
  const getHTMLContent = () => {
    if (!toot || isNotificationPage === 'follow') {
      return null
    }
    return (
      <View style={styles.htmlBox}>
        <TootContent
          navigation={navigation}
          toot={toot}
          sensitive={toot.sensitive}
          isNotificationPage={isNotificationPage}
        />
      </View>
    )
  }

  /**
   * @description 嘟文下方显示‘显示前文’：只有自己回复自己的嘟文才会出现
   */
  const showTreadFunc = () => {
    if (!showTread) {
      // 如果是在toot详情页面，无须显示该字符
      return null
    }

    if (!toot.in_reply_to_id || !toot.in_reply_to_account_id) {
      return null
    }

    if (toot.in_reply_to_account_id !== toot.account.id) {
      return null
    }

    return (
      <TouchableOpacity style={styles.showTreadButton} onPress={goTootDetail}>
        <Text style={[styles.showTreadText, { color: color.subColor }]}>
          显示前文
        </Text>
      </TouchableOpacity>
    )
  }

  /**
   * @description 转发toot
   * @param {id}: id
   * @param {reblogged}: 转发状态
   */
  const reblogFunc = (id, reblogged) => {
    reblog(mobx.domain, id, reblogged, {
      cancelToken: new CancelToken(c => cancel.push(c))
    }).then(res => {
      setToot(res)
    })
  }

  /**
   * @description 根据不同情况返回不同的转发图标，比如：私信页面/仅关注者/私信 禁止转发
   * @param {toot}: 嘟文数据
   */
  const getRetweetIcon = () => {
    if (toot.accounts) {
      return (
        <Icon
          style={{ fontSize: 15, color: color.lightThemeColor }}
          name="envelope"
        />
      )
    }

    if (toot.visibility === 'private' || toot.visibility === 'direct') {
      return (
        <Icon
          style={{ fontSize: 15, color: color.lightThemeColor }}
          name="lock"
        />
      )
    }

    return (
      <TouchableOpacity
        style={styles.iconParent}
        onPress={() => reblogFunc(toot.id, !toot.reblogged)}
      >
        {toot.reblogged ? (
          <Icon
            style={{ fontSize: 15, color: color.lightBlue }}
            name="retweet"
          />
        ) : (
          <Icon
            style={{ fontSize: 15, color: color.subColor }}
            name="retweet"
          />
        )}
        <Text style={{ marginLeft: 10, color: color.subColor }}>
          {toot.reblogs_count}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      {!isMaster ? (
        <TouchableOpacity onPress={goProfile}>
          <Avatar toot={toot || data} />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      <View
        style={{
          alignItems: 'stretch',
          flex: 1
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={goTootDetail}
          delayLongPress={2500}
          onLongPress={setClipboard}
        >
          <View style={styles.row}>
            {isMaster ? (
              <TouchableOpacity onPress={goProfile}>
                <Avatar toot={toot || data} />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={goProfile}
              style={
                isNotificationPage === 'follow'
                  ? styles.notificationTitleWidth
                  : styles.titleWidth
              }
            >
              <HTMLView
                navigation={navigation}
                content={toot.account.display_name || toot.account.username}
                mentions={toot.mentions}
                pTagStyle={{
                  color: color.contrastColor,
                  fontWeight: 'bold',
                  fontSize: 14,
                  ...pTagStyle
                }}
              />
              <Text
                style={[
                  styles.smallGrey,
                  { color: color.contrastColor },
                  pTagStyle
                ]}
              >
                &nbsp;@{toot.account.username}
              </Text>
            </TouchableOpacity>
            {getRelativeTimeOrIcon()}
          </View>
          {getHTMLContent()}
          <Media
            data={toot && toot.media_attachments}
            sensitive={toot && toot.sensitive}
          />
          {showTreadFunc()}
          {getIcons()}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
    fontWeight: 'normal'
  },
  titleWidth: {
    width: 220,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    overflow: 'hidden'
  },
  notificationTitleWidth: {
    width: 170,
    justifyContent: 'flex-start'
  },
  iconBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    width: '90%'
  },
  htmlBox: {
    flex: 1,
    marginTop: 10,
    marginRight: 20
  },
  menuIcon: {
    fontSize: 15,
    marginRight: 10
  },
  iconParent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  showTreadText: {
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

export default React.memo(BodyFunc, areEqual)
