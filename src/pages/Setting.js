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
import { Radio } from './common/Notice'
import { save } from '../utils/store'

let color = {}
@observer
export default class Setting extends Component {
  /**
   * @description 展示嘟文可见范围切换弹框
   */
  showVisibilityRange = () => {
    const visibility = {
      public: {
        value: false,
        label: '公开'
      },
      unlisted: {
        value: false,
        label: '不公开'
      },
      private: {
        value: false,
        label: '仅关注者'
      }
    }
    visibility[mobx.visibility].value = true
    Radio.show(
      '选择可见范围',
      visibility,
      item => {
        mobx.updateVisibility(item)
      },
      { height: 220 }
    )
  }

  /**
   * @description 展示主题切换弹框
   */
  showTheme = () => {
    const newTheme = {
      black: {
        value: false,
        label: '黑夜'
      },
      white: {
        value: false,
        label: '白天'
      }
    }
    newTheme[mobx.theme].value = true
    Radio.show(
      '切换主题',
      newTheme,
      theme => {
        mobx.updateTheme(theme)
        save('theme', theme).then(() => {})
      },
      { height: 200 }
    )
  }

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
              height: 50
            }}
          >
            <View
              style={{
                width: 40,
                marginRight: 20,
                alignItems: 'center'
              }}
            >
              <Icon
                name="list"
                style={{ fontSize: 20, color: color.contrastColor }}
              />
            </View>
            <TouchableOpacity
              style={{ width: '60%' }}
              activeOpacity={0.5}
              onPress={this.showVisibilityRange}
            >
              <Text
                style={{
                  fontSize: 15,
                  textAlign: 'left',
                  color: color.contrastColor
                }}
              >
                设置嘟文默认可见范围
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: 40,
                marginLeft: 20
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 50
            }}
          >
            <View
              style={{
                width: 40,
                marginRight: 20,
                alignItems: 'center'
              }}
            >
              <Icon
                name="user"
                style={{ fontSize: 20, color: color.contrastColor }}
              />
            </View>
            <TouchableOpacity
              style={{ width: '60%' }}
              activeOpacity={0.5}
              onPress={this.showTheme}
            >
              <Text
                style={{
                  fontSize: 15,
                  textAlign: 'left',
                  color: color.contrastColor
                }}
              >
                切换主题
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: 40,
                marginLeft: 20
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 50
            }}
          >
            <View
              style={{
                width: 40,
                height: 3,
                marginRight: 20
              }}
            />
            <Text
              style={{
                textAlign: 'left',
                width: '60%',
                fontSize: 15,
                color: color.contrastColor
              }}
            >
              滑动屏幕时隐藏发嘟按钮
            </Text>
            <View
              style={{
                width: 40,
                marginLeft: 20,
                alignItems: 'center'
              }}
            >
              <Switch
                value={mobx.hideSendTootButton}
                onValueChange={status =>
                  mobx.updateHideSendTooButtonStatus(status)
                }
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 50
            }}
          >
            <View
              style={{
                width: 40,
                height: 2,
                marginRight: 20
              }}
            />
            <Text
              style={{
                textAlign: 'left',
                width: '60%',
                fontSize: 15,
                color: color.contrastColor
              }}
            >
              总是显示敏感媒体文件
            </Text>
            <View
              style={{
                width: 40,
                marginLeft: 20,
                alignItems: 'center'
              }}
            >
              <Switch
                value={mobx.alwaysShowSensitiveMedia}
                onValueChange={status =>
                  mobx.updateAlwaysShowSensitiveMedia(status)
                }
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}
