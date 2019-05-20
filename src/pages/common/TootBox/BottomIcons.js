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
import { themeData } from '../../../utils/color'
import { Menu } from 'teaset'
import mobx from '../../../utils/mobx'
import { CancelToken } from 'axios'

const cheerio = require('react-native-cheerio')
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
 * @description 返回嘟文底部图标
 */
const BottomIconsFunc = ({
  data = {},
  deleteToot = () => {},
  setPin = () => {},
  muteAccount = () => {},
  blockAccount = () => {},
  navigation
}) => {
  const [toot, setToot] = useState(data)
  const color = themeData[mobx.theme]
  let cancel = []
  let theRef = null
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

    if (toot.visibility === 'private') {
      return (
        <Icon
          style={{ fontSize: 15, color: color.lightThemeColor }}
          name="lock"
        />
      )
    }

    if (toot.visibility === 'direct') {
      return (
        <Icon
          style={{ fontSize: 15, color: color.lightThemeColor }}
          name="envelope"
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

  /**
   * @description 转发toot
   * @param {id}: id
   * @param {reblogged}: 转发状态
   */
  const reblogFunc = (id, reblogged) => {
    reblog(mobx.domain, id, reblogged, {
      cancelToken: new CancelToken(c => cancel.push(c))
    }).then(() => {
      setToot({
        ...toot,
        reblogged: reblogged,
        reblogs_count: reblogged
          ? toot.reblogs_count + 1
          : toot.reblogs_count - 1
      })
    })
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

  /**
   * @description 给toot点赞，如果已经点过赞就取消点赞
   * @param {id}: id
   * @param {favourited}: 应该点赞？
   */
  const favouriteFunc = (id, favourited) => {
    favourite(mobx.domain, id, favourited, {
      cancelToken: new CancelToken(c => cancel.push(c))
    }).then(() => {
      setToot({
        ...toot,
        favourited: favourited,
        favourites_count: favourited
          ? toot.favourites_count + 1
          : toot.favourites_count - 1
      })
    })
  }

  const replyTo = () => {
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
      setPin(toot.id, toot.pinned)
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

    theRef.measureInWindow((x, y, width, height) => {
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
          <Icon style={{ fontSize: 15, color: color.gold }} name="star" solid />
        ) : (
          <Icon style={{ fontSize: 15, color: color.subColor }} name="star" />
        )}
        <Text style={{ marginLeft: 10, color: color.subColor }}>
          {toot.favourites_count}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconParent}
        ref={ref => (theRef = ref)}
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

const styles = StyleSheet.create({
  iconBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    width: '90%'
  },
  menuIcon: {
    fontSize: 15,
    marginRight: 10
  },
  iconParent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  }
})

export default React.memo(BottomIconsFunc, areEqual)
