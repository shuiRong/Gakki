import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import HTMLView from '../HTMLView'
import { themeData } from '../../../utils/color'
import mobx from '../../../utils/mobx'

// 嘟文主体内容
const TootContentAreEqual = (prevProps, nextProps) => {
  return (
    prevProps.hide === nextProps.hide && prevProps.toot.id === nextProps.toot.id
  )
}

const TootContentFunc = ({
  sensitive = false,
  navigation = () => {},
  toot = {},
  isNotificationPage = false
}) => {
  const color = themeData[mobx.theme]
  const [hide, setHide] = useState(sensitive)
  let pTagStyle = {}

  if (isNotificationPage) {
    pTagStyle = {
      color: color.subColor
    }
  }

  // 这里不用使用hide变量来做判断，否则会因为hide变量造成render函数的再次调用而造成错误的预期
  if (!sensitive) {
    return (
      <HTMLView
        navigation={navigation}
        content={toot.content}
        mentions={toot.mentions}
        hide={hide}
        pTagStyle={pTagStyle}
      />
    )
  }

  // 如果是NSFW模式，直接展示content（因为没有spoiler_text，有的话就是CW模式了）
  if (!toot.spoiler_text) {
    return (
      <HTMLView
        navigation={navigation}
        content={toot.content}
        mentions={toot.mentions}
        hide={false}
        pTagStyle={pTagStyle}
      />
    )
  }

  const changeHideStatus = () => setHide(!hide)

  return (
    <View>
      <View>
        <HTMLView
          navigation={navigation}
          content={toot.spoiler_text}
          mentions={toot.mentions}
          pTagStyle={{
            color: color.contrastColor,
            fontSize: 16,
            ...pTagStyle
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: color.subColor,
            width: 75,
            borderRadius: 3,
            padding: 5,
            paddingTop: 3,
            paddingBottom: 3,
            margin: 3,
            marginLeft: 0
          }}
          onPress={changeHideStatus}
        >
          <Text
            style={{
              color: color.themeColor,
              textAlign: 'center'
            }}
          >
            {hide ? '显示内容' : '隐藏内容'}
          </Text>
        </TouchableOpacity>
        <HTMLView
          navigation={navigation}
          content={toot.content}
          mentions={toot.mentions}
          hide={hide}
          pTagStyle={pTagStyle}
        />
      </View>
    </View>
  )
}

export default React.memo(TootContentFunc, TootContentAreEqual)
