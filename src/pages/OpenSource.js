/**
 * 用到的开源软件的协议
 */

import React, { Component } from 'react'
import { View, ScrollView, Text, TouchableOpacity, Linking } from 'react-native'
import Header from './common/Header'
import { Button } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import { observer } from 'mobx-react'

let color = {}

class Card extends Component {
  openURL = url => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err))
  }

  render() {
    const data = this.props.data

    return (
      <View
        style={{
          padding: 10,
          backgroundColor: color.themeColor,
          marginBottom: 10,
          elevation: 3,
          borderRadius: 5
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            color: color.contrastColor
          }}
        >
          {data.name}
        </Text>
        <Text style={{ color: color.contrastColor }}>{data.license}</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this.openURL(data.address)}
        >
          <Text style={{ color: color.contrastColor }}>{data.address}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

@observer
export default class MutedUsers extends Component {
  render() {
    color = themeData[mobx.theme]

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: color.themeColor,
          flex: 1
        }}
      >
        <Header
          left={
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon
                style={{ color: color.subColor, fontSize: 17 }}
                name={'arrow-left'}
              />
            </Button>
          }
          title={'开源协议声明'}
          right={'none'}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: color.themeColor,
            marginTop: 5,
            paddingLeft: 10,
            paddingRight: 10
          }}
        >
          <Text
            style={{
              fontSize: 15,
              marginTop: 10,
              marginBottom: 10,
              marginLeft: 5,
              color: color.contrastColor
            }}
          >
            Gakki 使用了以下开源项目的源码：
          </Text>
          {data.map(item => (
            <Card data={item} />
          ))}
        </View>
      </ScrollView>
    )
  }
}

const data = [
  {
    name: 'axios',
    license: 'MIT',
    address: 'https://github.com/axios/axios/blob/master/LICENSE'
  },
  {
    name: 'jstz',
    license: 'MIT',
    address: 'https://github.com/iansinnott/jstz/blob/master/LICENCE'
  },
  {
    name: 'mobx',
    license: 'MIT',
    address: 'https://github.com/mobxjs/mobx/blob/master/LICENSE'
  },
  {
    name: 'mobx-react',
    license: 'MIT',
    address: 'https://github.com/mobxjs/mobx-react/blob/master/LICENSE'
  },
  {
    name: 'moment-timezone',
    license: 'MIT',
    address: 'https://github.com/moment/moment-timezone/blob/develop/LICENSE'
  },
  {
    name: 'native-base',
    license: 'Apache License 2.0',
    address: 'https://github.com/GeekyAnts/NativeBase/blob/master/LICENSE'
  },
  {
    name: 'prop-types',
    license: 'MIT',
    address: 'https://github.com/facebook/prop-types/blob/master/LICENSE'
  },
  {
    name: 'react',
    license: 'MIT',
    address: 'https://github.com/facebook/react/blob/master/LICENSE'
  },
  {
    name: 'react-native',
    license: 'MIT',
    address: 'https://github.com/facebook/react-native/blob/master/LICENSE'
  },
  {
    name: 'react-native-gesture-handler',
    license: 'MIT',
    address:
      'https://github.com/kmagiera/react-native-gesture-handler/blob/master/LICENSE'
  },
  {
    name: 'react-native-image-picker',
    license: 'MIT',
    address:
      'https://github.com/react-native-community/react-native-image-picker/blob/master/LICENSE.md'
  },
  {
    name: 'react-native-material-ripple',
    license: 'BSD License',
    address:
      'https://github.com/n4kz/react-native-material-ripple/blob/master/license.txt'
  },
  {
    name: 'react-native-render-html',
    license: 'BSD 2-Clause "Simplified" License',
    address:
      'https://github.com/archriss/react-native-render-html/blob/master/LICENSE'
  },
  {
    name: 'react-native-scrollable-tab-view',
    license: 'MIT',
    address: 'https://github.com/ptomasroos/react-native-scrollable-tab-view'
  },
  {
    name: 'react-native-textinput-effects',
    license: 'MIT',
    address:
      'https://github.com/halilb/react-native-textinput-effects/blob/master/LICENCE'
  },
  {
    name: 'react-native-vector-icons',
    license: 'MIT',
    address:
      'https://github.com/oblador/react-native-vector-icons/blob/master/LICENSE'
  },
  {
    name: 'react-navigation',
    license: 'BSD License',
    address:
      'https://github.com/react-navigation/react-navigation/blob/master/LICENSE'
  },
  {
    name: 'relative-time-react-native-component',
    license: 'MIT',
    address:
      'https://github.com/plantain-00/relative-time-component/blob/master/LICENSE'
  },
  {
    name: 'teaset',
    license: 'MIT',
    address: 'https://github.com/rilyu/teaset/blob/master/LICENSE'
  },
  {
    name: 'babel',
    license: 'MIT',
    address: 'https://github.com/babel/babel/blob/master/LICENSE'
  },
  {
    name: 'jest',
    license: 'MIT',
    address: 'https://github.com/facebook/jest/blob/master/LICENSE'
  },
  {
    name: 'babel-preset-mobx',
    license: 'MIT',
    address:
      'https://github.com/zwhitchcox/babel-preset-mobx/blob/master/LICENSE'
  },
  {
    name: 'jsc-android',
    license: 'BSD 2-Clause "Simplified" License',
    address:
      'https://github.com/react-native-community/jsc-android-buildscripts/blob/master/LICENSE'
  },
  {
    name: 'metro-react-native-babel-preset',
    license: 'MIT',
    address: 'https://github.com/facebook/metro/blob/master/LICENSE'
  }
]
