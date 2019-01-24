/**
 * 关于界面
 */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Header from './common/Header'
import { Button } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import { observer } from 'mobx-react'

let color = {}
@observer
export default class MutedUsers extends Component {
  render() {
    color = themeData[mobx.theme]

    return (
      <View style={{ backgroundColor: color.themeColor, flex: 1 }}>
        <Header
          left={
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon
                style={{ color: color.subColor, fontSize: 17 }}
                name="arrow-left"
              />
            </Button>
          }
          title={'关于 Gakki'}
          right={'none'}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: color.themeColor,
            alignItems: 'center',
            padding: 20,
            marginTop: 5
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: color.contrastColor,
              margin: 20
            }}
          >
            Gakki 1.0
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: color.contrastColor
            }}
          >
            Gakki
            是基于MIT开源协议的自由软件。完整的许可证协议见：https://github.com/shuiRong/Gakki/blob/master/LICENSE
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: color.contrastColor,
              marginTop: 10
            }}
          >
            源代码：
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: color.contrastColor
            }}
          >
            https://github.com/shuiRong/Gakki
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: color.contrastColor,
              marginTop: 10
            }}
          >
            问题或反馈：
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: color.contrastColor,
              textAlign: 'center'
            }}
          >
            https://github.com/shuiRong/Gakki/issues
          </Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('Profile', {
                id: '81232'
              })
            }
            activeOpacity={0.5}
            style={{
              marginTop: 20,
              borderColor: color.contrastColor,
              borderRadius: 3,
              borderWidth: 1,
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: color.contrastColor
              }}
            >
              Gakki 官方账号
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('OpenSource')}
            activeOpacity={0.5}
            style={{
              marginTop: 20,
              borderColor: color.contrastColor,
              borderRadius: 3,
              borderWidth: 1,
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10
            }}
          >
            <Text
              style={{
                fontSize: 17,
                color: color.contrastColor
              }}
            >
              开源协议
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
