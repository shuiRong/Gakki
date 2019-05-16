import React, { useState, useEffect } from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { muteAccount, blockAccount, checkRequest } from '../../utils/api'
import { themeData } from '../../utils/color'
import mobx from '../../utils/mobx'
import HTMLView from './HTMLView'
import { CancelToken } from 'axios'

/**
 * @param {model}: 当前组件使用的模式，模式不同展示的右侧图标不同
 */
export default ({
  account = {},
  relationshipData = {},
  deleteUser = () => {},
  model = '',
  navigation = () => {}
}) => {
  const color = themeData[mobx.theme]
  let cancel = []
  const [relationship, setRelationship] = useState(relationshipData)

  useEffect(() => {
    // 没有“副作用”，仅仅为了取消请求
    return () => {
      cancel.forEach(item => item && item())
    }
  })

  /**
   * @description 是否屏蔽、取消屏蔽账号
   */
  const blockAccountFunc = block => {
    const id = account.id
    blockAccount(mobx.domain, id, block, {
      cancelToken: new CancelToken(c => cancel.push(c))
    }).then(() => {
      if (!block) {
        deleteUser(id)
        return
      }
    })
  }

  /**
   * @description 是否隐藏、取消隐藏账号
   */
  const muteAccountFunc = (mute, notification) => {
    const id = account.id
    muteAccount(mobx.domain, id, mute, notification, {
      cancelToken: new CancelToken(c => cancel.push(c))
    }).then(() => {
      if (!mute) {
        deleteUser(id)
        return
      }

      setRelationship({
        ...relationship,
        muting_notifications: notification
      })
    })
  }

  const checkRequestFunc = status => {
    const id = account.id
    checkRequest(mobx.domain, id, status, {
      cancelToken: new CancelToken(c => cancel.push(c))
    }).then(() => {
      deleteUser(id)
    })
  }

  /**
   * @description 获取右侧图标
   */
  const getRightIcon = () => {
    if (!model) {
      return null
    } else if (model === 'request') {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => checkRequestFunc(false)}
        >
          <Icon
            name={'times'}
            style={{
              fontSize: 18,
              color: color.contrastColor,
              marginRight: 15
            }}
          />
        </TouchableOpacity>
      )
    } else if (model === 'block') {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => blockAccountFunc(false)}
        >
          <Icon
            name={'unlock'}
            style={{ fontSize: 18, color: color.contrastColor }}
          />
        </TouchableOpacity>
      )
    }

    // mute页面的话
    return relationship.muting_notifications ? (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => muteAccountFunc(true, false)}
      >
        <Icon
          name={'bell'}
          style={{ fontSize: 18, color: color.contrastColor }}
        />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => muteAccountFunc(true, true)}
      >
        <Icon
          name={'bell-slash'}
          style={{ fontSize: 18, color: color.contrastColor }}
        />
      </TouchableOpacity>
    )
  }

  const getLeftIcon = () => {
    if (!model) {
      return null
    } else if (model === 'request') {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => checkRequestFunc(true)}
        >
          <Icon
            name={'check'}
            style={{
              fontSize: 18,
              color: color.contrastColor,
              marginRight: 15
            }}
          />
        </TouchableOpacity>
      )
    } else if (model === 'mute') {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => muteAccountFunc(false)}
        >
          <Icon
            name={'volume-up'}
            style={{
              fontSize: 18,
              color: color.contrastColor,
              marginRight: 15
            }}
          />
        </TouchableOpacity>
      )
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate('Profile', {
            id: account.id
          })
        }}
      >
        <Image
          source={{ uri: account.avatar }}
          style={{
            overlayColor: color.themeColor,
            width: 40,
            height: 40,
            borderRadius: 5,
            marginRight: 5
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ width: '65%' }}
        activeOpacity={0.5}
        onPress={() =>
          navigation.navigate('Profile', {
            id: account.id
          })
        }
      >
        <HTMLView content={account.display_name || account.username || ''} />
        <Text style={{ color: color.subColor }}>@{account.username}</Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '18%'
        }}
      >
        {getLeftIcon()}

        <View
          style={{
            width: '60%',
            alignItems: 'center'
          }}
        >
          {getRightIcon()}
        </View>
      </View>
    </View>
  )
}
