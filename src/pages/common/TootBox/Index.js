import React from 'react'
import { View, StatusBar } from 'react-native'
import { themeData } from '../../../utils/color'
import mobx from '../../../utils/mobx'
import AdditionalInfo from './AdditionalInfo'
import Body from './Body'

const TootBoxAreEqual = (prevProps, nextProps) => {
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

const TootBox = props => {
  const color = themeData[mobx.theme]
  const barStyle = mobx.theme === 'black' ? 'light-content' : 'dark-content'

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        paddingTop: 15,
        backgroundColor: color.themeColor
      }}
    >
      <StatusBar backgroundColor={color.themeColor} barStyle={barStyle} />
      <AdditionalInfo {...props} />
      <Body {...props} />
    </View>
  )
}

export default React.memo(TootBox, TootBoxAreEqual)
