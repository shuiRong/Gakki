/**
 * 设置界面
 */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Switch } from 'react-native'
import Header from './common/Header'
import { Button } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import { observer } from 'mobx-react'

let color = {}
@observer
export default class Setting extends Component {
  render() {
    color = themeData[mobx.theme]

    return (
      <View style={{ backgroundColor: color.themeColor, flex: 1 }}>
        <Header
          left={
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon
                style={{ color: color.subColor, fontSize: 17 }}
                name={'arrow-left'}
              />
            </Button>
          }
          title={'设置'}
          right={'none'}
        />
        <View
          style={{
            backgroundColor: color.themeColor,
            paddingHorizontal: 20
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <Text style={{ marginRight: 20 }}>滑动屏幕时隐藏发嘟按钮</Text>
            <Switch
              value={mobx.hideSendTootButton}
              onValueChange={status =>
                mobx.updateHideSendTooButtonStatus(status)
              }
            />
          </View>
        </View>
      </View>
    )
  }
}
