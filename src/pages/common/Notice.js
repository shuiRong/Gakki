import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Overlay } from 'teaset'
import { CheckBox } from 'native-base'
import mobx from '../../utils/mobx'
import { themeData } from '../../utils/color'

let color = themeData[mobx.theme]

// 消息确认框
class ConfirmDialog {
  constructor() {
    this.key = undefined
  }
  show = (title, cb, options = { style: {}, isModal: true }) => {
    let overlayView = (
      <Overlay.View
        style={{ alignItems: 'center', justifyContent: 'center' }}
        modal={options.isModal}
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
            justifyContent: 'space-between',
            ...options.style
          }}
        >
          {typeof title === 'string' ? (
            <Text
              style={{
                marginTop: 20,
                fontSize: 18,
                color: color.contrastColor
              }}
            >
              {title || '确认框信息提示'}
            </Text>
          ) : (
            title
          )}
          <View
            style={{
              alignSelf: 'flex-end',
              flexDirection: 'row',
              marginBottom: 20
            }}
          >
            {options.hideCancel || (
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
            )}
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
    this.key = Overlay.show(overlayView)
  }

  hide = () => {
    Overlay.hide(this.key)
  }
}

class ThemeList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.setState({ ...this.props.data })
  }

  /**
   * @description 切换Radio选项的动作
   * @param {which}: 用户选择的选项
   * @param {callback}: 除默认动作之外，自定义的函数
   */
  exchange = which => {
    const props = this.props
    const newTheme = {
      ...this.state
    }
    newTheme[which].value = true
    props.hide()
    props.callback && props.callback(which)
    this.setState(newTheme)
  }

  render() {
    const state = this.state
    return (
      <View
        style={{
          alignSelf: 'flex-start'
        }}
      >
        <Text style={{ fontSize: 21, color: color.contrastColor }}>
          {this.props.title}
        </Text>
        <View style={{ flex: 1, marginTop: 0 }}>
          {Object.keys(state).map(item => (
            <View style={styles.themeList}>
              <CheckBox
                checked={state[item].value}
                color={color.subColor}
                onPress={() => this.exchange(item)}
              />
              <Text
                style={[styles.themeListText, { color: color.contrastColor }]}
              >
                {state[item].label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )
  }
}

// 带有单选框的Dialog
class RadioDialog {
  constructor() {
    this.key = undefined
  }

  /**
   * @param {data}: 选项数据
   * @param {callback}: 除默认动作之外，自定义的函数
   * @param {style}: 自定义的样式
   */
  show = (title, data, callback, style) => {
    let overlayView = (
      <Overlay.View
        style={{ alignItems: 'center', justifyContent: 'center' }}
        overlayOpacity={0.5}
        ref={v => (this.overlayView = v)}
      >
        <View
          style={{
            backgroundColor: color.themeColor,
            padding: 20,
            width: '85%',
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'space-around',
            ...style
          }}
        >
          <ThemeList
            data={data}
            title={title}
            callback={callback}
            hide={() => this.hide()}
          />
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              marginBottom: 10
            }}
            onPress={() => this.overlayView && this.overlayView.close()}
            activeOpacity={0.5}
          >
            <Text style={{ color: color.contrastColor }}> 取消</Text>
          </TouchableOpacity>
        </View>
      </Overlay.View>
    )

    this.key = Overlay.show(overlayView)
  }

  hide = () => {
    Overlay.hide(this.key)
  }
}

export const Confirm = new ConfirmDialog()
export const Radio = new RadioDialog()

const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  bg: {
    width: '100%',
    height: 120
  },
  infoBox: {
    height: 120,
    padding: 15
  },
  info: {
    marginTop: 10
  },
  body: {
    paddingTop: 10,
    flex: 1,
    flexDirection: 'column',
    marginTop: 20
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
  iconBox: {
    width: 40,
    marginRight: 20,
    marginLeft: 10,
    alignItems: 'center'
  },
  icon: {
    fontSize: 23
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50
  },
  themeList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: -5
  },
  themeListText: {
    marginLeft: 30,
    fontSize: 18
  }
})
