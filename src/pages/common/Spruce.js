import React, { Component } from 'react'
import { View, StatusBar, Dimensions } from 'react-native'
import { observer } from 'mobx-react'
import mobx from '../../utils/mobx'
import { themeData } from '../../utils/color'
import ContentLoader from 'react-native-content-loader'
import { Circle, Rect } from 'react-native-svg'

const width = Dimensions.get('window').width
let color = {}
@observer
export class TootListSpruce extends Component {
  render() {
    color = themeData[mobx.theme]
    const barStyle = mobx.theme === 'black' ? 'light-content' : 'dark-content'
    const primaryColor = color.lightThemeColor
    const secondaryColor =
      mobx.theme === 'black' ? color.lightBlack : color.lightGrey

    return (
      <View>
        <StatusBar backgroundColor={color.themeColor} barStyle={barStyle} />
        <View
          style={{
            width,
            height: 200,
            alignItems: 'center',
            marginTop: 20
          }}
        >
          <ContentLoader
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            width={width * 0.9}
            height={200}
            duration={1000}
          >
            <Circle cx="30" cy="30" r="30" />
            <Rect x="75" y="13" rx="4" ry="4" width="200" height="10" />
            <Rect x="75" y="37" rx="4" ry="4" width="140" height="8" />
            <Rect x="0" y="70" rx="5" ry="5" width="400" height="200" />
          </ContentLoader>
        </View>
        <View
          style={{
            width,
            height: 200,
            alignItems: 'center',
            marginTop: 20
          }}
        >
          <ContentLoader
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            width={width * 0.9}
            height={200}
            duration={1000}
          >
            <Circle cx="30" cy="30" r="30" />
            <Rect x="75" y="13" rx="4" ry="4" width="200" height="10" />
            <Rect x="75" y="37" rx="4" ry="4" width="140" height="8" />
            <Rect x="0" y="70" rx="5" ry="5" width="400" height="200" />
          </ContentLoader>
        </View>
        <View
          style={{
            width,
            height: 200,
            alignItems: 'center',
            marginTop: 20
          }}
        >
          <ContentLoader
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            width={width * 0.9}
            height={200}
            duration={1000}
          >
            <Circle cx="30" cy="30" r="30" />
            <Rect x="75" y="13" rx="4" ry="4" width="200" height="10" />
            <Rect x="75" y="37" rx="4" ry="4" width="140" height="8" />
            <Rect x="0" y="70" rx="5" ry="5" width="400" height="200" />
          </ContentLoader>
        </View>
      </View>
    )
  }
}

@observer
export class CodeStyleSpruce extends Component {
  render() {
    color = themeData[mobx.theme]
    const barStyle = mobx.theme === 'black' ? 'light-content' : 'dark-content'
    const primaryColor = color.lightThemeColor
    const secondaryColor =
      mobx.theme === 'black' ? color.lightBlack : color.lightGrey

    return (
      <View
        style={{ marginTop: 20, alignItems: 'center', ...this.props.style }}
      >
        <StatusBar backgroundColor={color.themeColor} barStyle={barStyle} />
        <ContentLoader
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          height={80}
          duration={1000}
        >
          <Rect x="0" y="0" rx="3" ry="3" width="70" height="10" />
          <Rect x="80" y="0" rx="3" ry="3" width="100" height="10" />
          <Rect x="190" y="0" rx="3" ry="3" width="10" height="10" />
          <Rect x="15" y="20" rx="3" ry="3" width="130" height="10" />
          <Rect x="155" y="20" rx="3" ry="3" width="130" height="10" />
          <Rect x="15" y="40" rx="3" ry="3" width="90" height="10" />
          <Rect x="115" y="40" rx="3" ry="3" width="60" height="10" />
          <Rect x="185" y="40" rx="3" ry="3" width="60" height="10" />
          <Rect x="0" y="60" rx="3" ry="3" width="30" height="10" />
        </ContentLoader>
      </View>
    )
  }
}

@observer
export class ProfileSpruce extends Component {
  render() {
    color = themeData[mobx.theme]
    const barStyle = mobx.theme === 'black' ? 'light-content' : 'dark-content'
    const primaryColor = color.lightThemeColor
    const secondaryColor =
      mobx.theme === 'black' ? color.lightBlack : color.lightGrey

    return (
      <View style={{ height: 330 }}>
        <StatusBar backgroundColor={color.themeColor} barStyle={barStyle} />
        <ContentLoader
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          width={width}
          height={500}
          duration={1000}
        >
          <Rect x="0" y="0" rx="5" ry="5" width={width} height="155" />
          <Rect x="15" y="115" rx="3" ry="3" width="80" height="80" />
          <Rect x={width * 0.7} y="170" rx="3" ry="3" width="100" height="35" />
          <Rect x="15" y="205" rx="3" ry="3" width="80" height="10" />
          <Rect x="15" y="220" rx="3" ry="3" width="80" height="10" />

          <Rect x="65" y="250" rx="3" ry="3" width="70" height="10" />
          <Rect x="145" y="250" rx="3" ry="3" width="100" height="10" />
          <Rect x="255" y="250" rx="3" ry="3" width="10" height="10" />
          <Rect x="15" y="270" rx="3" ry="3" width="130" height="10" />
          <Rect x="170" y="270" rx="3" ry="3" width="130" height="10" />
          <Rect x="30" y="290" rx="3" ry="3" width="90" height="10" />
          <Rect x="130" y="290" rx="3" ry="3" width="60" height="10" />
          <Rect x="200" y="290" rx="3" ry="3" width="60" height="10" />
        </ContentLoader>
      </View>
    )
  }
}

@observer
export class UserSpruce extends Component {
  render() {
    color = themeData[mobx.theme]
    const barStyle = mobx.theme === 'black' ? 'light-content' : 'dark-content'
    const primaryColor = color.lightThemeColor
    const secondaryColor =
      mobx.theme === 'black' ? color.lightBlack : color.lightGrey

    const item = (
      <ContentLoader
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        width={width}
        height={60}
        duration={1000}
      >
        <Rect x="15" y="15" rx="3" ry="3" width="40" height="40" />
        <Rect x="70" y="22" rx="3" ry="3" width="100" height="10" />
        <Rect x="70" y="40" rx="3" ry="3" width="200" height="10" />
      </ContentLoader>
    )

    return (
      <View
        style={{
          width,
          height: 60
        }}
      >
        <StatusBar backgroundColor={color.themeColor} barStyle={barStyle} />
        {item}
        {item}
        {item}
        {item}
        {item}
        {item}
        {item}
      </View>
    )
  }
}
