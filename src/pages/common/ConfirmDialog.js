import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Overlay } from 'teaset'
import mobx from '../../utils/mobx'
import { themeData } from '../../utils/color'

let color = themeData[mobx.theme]
let key = undefined
export default class ConfirmDialog {
  static show = (title, cb) => {
    let overlayView = (
      <Overlay.View
        style={{ alignItems: 'center', justifyContent: 'center' }}
        modal={true}
        overlayOpacity={0.5}
        ref={v => (this.overlayView = v)}
      >
        <View
          style={{
            backgroundColor: color.themeColor,
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            width: '85%',
            height: 120,
            borderRadius: 5,
            alignItems: 'flex-start',
            justifyContent: 'space-around'
          }}
        >
          <Text style={{ fontSize: 18, color: color.contrastColor }}>
            {title || '确认框信息提示'}
          </Text>
          <View
            style={{
              alignSelf: 'flex-end',
              flexDirection: 'row'
            }}
          >
            <TouchableOpacity
              onPress={() => this.overlayView && this.overlayView.close()}
            >
              <Text
                style={{
                  color: color.subColor,
                  fontSize: 15,
                  fontWeight: 'bold',
                  marginRight: 20
                }}
              >
                取消
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                cb && cb()
                this.overlayView && this.overlayView.close()
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: color.contrastColor
                }}
              >
                确定
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay.View>
    )
    key = Overlay.show(overlayView)
  }

  static hide = () => {
    Overlay.hide(key)
  }
}
