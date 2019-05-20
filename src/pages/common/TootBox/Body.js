import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import momentTimezone from 'moment-timezone'
import jstz from 'jstz'
import { RelativeTime } from 'relative-time-react-native-component'
import { zh } from '../../../utils/locale'
import Media from '../Media'
import { themeData } from '../../../utils/color'
import mobx from '../../../utils/mobx'
import HTMLView from '../HTMLView'
import TootContent from './TootContent'
import Avatar from './Avatar'
import BottomIcons from './BottomIcons'

const timezone = jstz.determine().name() // 获得当前用户所在的时区
const areEqual = (prevProps, nextProps) =>
  prevProps.data.id === nextProps.data.id

/**
 * @description 需要考虑到普通嘟文和通知接口的嘟文两种数据格式
 * @param {showTread}: 是否显示'显示前文字符'
 * @param {isMaster}: 当前的嘟文再详情页面展示时是主要还是次要（主要区别是头像是和用户名展示在一起还是单独一列）
 */
const BodyFunc = props => {
  const { isMaster, data, showTread, navigation } = props
  const color = themeData[mobx.theme]

  let toot = null // 有type属性，表示是Notification entity. 如果数据为空，说明情况是：Notification Entity 中的follow类型
  if (data.type) {
    toot = data.status || data
  } else {
    toot = data.reblog || data
  }
  const isNotificationPage = data.type // 当前组件是否使用在通知页面，因为通知接口返回的数据格式稍有不同
  let pTagStyle = { color: color.contrastColor }

  if (isNotificationPage) {
    pTagStyle = {
      color: color.subColor
    }
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
        <TouchableOpacity activeOpacity={0.5} onPress={goTootDetail}>
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
          {isNotificationPage !== 'follow' && (
            <BottomIcons {...props} data={toot} />
          )}
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
  htmlBox: {
    flex: 1,
    marginTop: 10,
    marginRight: 20
  },
  showTreadText: {
    fontSize: 15,
    textAlign: 'left'
  },
  showTreadButton: {
    marginTop: 5,
    width: 100
  }
})

export default React.memo(BodyFunc, areEqual)
