import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import mobx from '../../../utils/mobx'
import { themeData } from '../../../utils/color'
import HTMLView from '../HTMLView'

const areEqual = (prevProps, nextPros) => {
  return prevProps.data.id === nextPros.data.id
}

// 嘟文上方的附加信息：转嘟、置顶...
const AdditionalInfoFunc = ({ data = {}, navigation = () => {} }) => {
  const color = themeData[mobx.theme]
  let type = undefined
  let pTagStyle = { color: color.subColor }
  const toot = data.type ? data.status : data // 有type属性，表示是Notification entity
  const isNotificationPage = Boolean(data.type) // 当前组件是否使用在通知页面，因为通知接口返回的数据格式稍有不同
  const info = {
    reblog: '转嘟了',
    pinned: '置顶嘟文',
    favourite: '收藏了',
    follow: '开始关注你',
    mention: '提及了'
  }
  const icon = {
    reblog: 'retweet',
    pinned: 'thumbtack',
    favourite: 'star',
    follow: 'user-plus'
  }
  const iconColor = {
    favourite: color.gold,
    follow: color.lightgreen,
    reblog: color.lightBlue,
    pinned: color.lightContrastColor
  }

  if (isNotificationPage) {
    // 如果是在通知页面，那么类型的名称可以直接当作变量名
    type = data.type
    pTagStyle = {
      fontWeight: 'bold',
      color: color.contrastColor
    }
  } else if (toot) {
    // 如果嘟文内容存在，即普通嘟文模式
    if (toot.reblog) {
      type = 'reblog'
    } else if (toot.pinned) {
      type = 'pinned'
    }
  }

  if (type === undefined) {
    return null
  }

  /**
   * @description 跳转入个人详情页面
   * @param {id}: id
   */
  const goProfile = id => {
    if (!props) {
      return
    }
    navigation.navigate('Profile', {
      id: id
    })
  }

  /**
   * @description 返回嘟文上面的附加信息的用户名
   * 通知页面和其他页面所需要的用户名的数据来源不同
   */
  const getDisplayName = () => {
    let account = toot && toot.account
    if (isNotificationPage) {
      account = data.account
    }

    return (
      <TouchableOpacity
        style={{
          width: '60%'
        }}
        activeOpacity={0.5}
        onPress={() => goProfile(account.id)}
      >
        <HTMLView
          navigation={navigation}
          content={account.display_name || account.username}
          mentions={toot ? toot.mentions : []}
          pTagStyle={pTagStyle}
        />
      </TouchableOpacity>
    )
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: -5
      }}
    >
      <Icon
        name={icon[type]}
        style={{
          width: 40,
          fontSize: 15,
          marginRight: 10,
          textAlign: 'right',
          color: iconColor[type]
        }}
        solid
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1
        }}
      >
        {getDisplayName()}
        <Text style={[{ color: color.lightContrastColor }, pTagStyle]}>
          {info[type]}
        </Text>
      </View>
    </View>
  )
}

export default React.memo(AdditionalInfoFunc, areEqual)
