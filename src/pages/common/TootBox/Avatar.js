import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import mobx from '../../../utils/mobx'
import { themeData } from '../../../utils/color'

const areEqual = (prevProps, nextPros) => {
  return prevProps.toot.id === nextPros.toot.id
}

/**
 * @description 获取用户头像，如果是转发，则同时显示两人头像
 */
const AvatarFunc = ({ toot }) => {
  const color = themeData[mobx.theme]

  /**
   * @description 私信页面的头像，需要对两个及其以上的 @ 用户头像特殊处理
   */
  const getEnvelopeAvatar = () => {
    const accounts = toot.accounts
    if (accounts.length === 2) {
      return (
        <View
          style={{
            width: 40,
            height: 40,
            marginRight: 10,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Image
            style={{
              width: 19,
              height: 40,
              borderRadius: 3,
              overlayColor: color.themeColor
            }}
            source={{ uri: accounts[0].avatar }}
          />
          <Image
            style={{
              width: 19,
              height: 40,
              borderRadius: 3,
              overlayColor: color.themeColor
            }}
            source={{ uri: accounts[1].avatar }}
          />
        </View>
      )
    } else {
      return (
        <View
          style={{
            width: 40,
            height: 40,
            marginRight: 10,
            justifyContent: 'space-between',
            alignItems: 'space-between'
          }}
        >
          <View
            style={{
              width: 40,
              height: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <Image
              style={{
                width: 19,
                height: 19,
                borderRadius: 3,
                overlayColor: color.themeColor
              }}
              source={{ uri: accounts[0].avatar }}
            />
            <Image
              style={{
                width: 19,
                height: 19,
                borderRadius: 3,
                overlayColor: color.themeColor
              }}
              source={{ uri: accounts[1].avatar }}
            />
          </View>
          <View
            style={{
              width: 40,
              height: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}
          >
            <Image
              style={{
                width: 19,
                height: 19,
                borderRadius: 3,
                overlayColor: color.themeColor
              }}
              source={{ uri: accounts[2].avatar }}
            />
            {accounts[3] ? (
              <Image
                style={{
                  width: 19,
                  height: 19,
                  marginLeft: 2,
                  borderRadius: 3,
                  overlayColor: color.themeColor
                }}
                source={{ uri: accounts[3].avatar }}
              />
            ) : (
              <View />
            )}
          </View>
        </View>
      )
    }
  }

  if (!toot.reblog) {
    // 如果是私信页面的头像
    if (toot.accounts) {
      // 且 @ 的用户只有一个，照常展示
      if (toot.accounts.length === 1) {
        toot.account = toot.accounts[0]
      } else {
        // 如果涉及的用户多于一个，则另外处理
        return getEnvelopeAvatar()
      }
    }

    return (
      <Image
        style={[styles.avatar, { overlayColor: color.themeColor }]}
        source={{ uri: toot.account.avatar }}
      />
    )
  }

  return (
    <View style={{ width: 40, height: 40, marginRight: 10 }}>
      <Image
        style={[styles.avatarTopLeft, , { overlayColor: color.themeColor }]}
        source={{ uri: toot.reblog.account.avatar }}
      />
      <Image
        style={[styles.avatarBottomRight, { overlayColor: color.themeColor }]}
        source={{ uri: toot.account.avatar }}
      />
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

export default React.memo(AvatarFunc, areEqual)
