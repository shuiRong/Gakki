import React, { Component } from 'react'
import { observer } from 'mobx-react'
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { sendStatuses } from '../../utils/api'
import mobx from '../../utils/mobx'
import { color } from '../../utils/color'

@observer
export default class ReplyInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: '',
      spoiler_text: '', // 警告消息，警告前方可能出现的特殊内容
      expand: false, // 输入框是否展开成多行？
      cw: false, // Content Warning 模式是否开启
      whichIsFocused: '' // 当前哪个输入框被触发了
    }
  }

  showCW = () => {
    this.setState({
      cw: !this.state.cw
    })
  }

  sendToot = () => {
    const state = this.state
    const props = this.props

    sendStatuses({
      in_reply_to_id: mobx.in_reply_to_id,
      status: mobx.inputValue,
      spoiler_text: state.cw ? state.spoiler_text : '',
      visibility: 'public',
      sensitive: false
    }).then(res => {
      if (props.appendReply) {
        props.appendReply(res)
      }
      if (props.scrollToEnd) {
        props.scrollToEnd()
      }
      if (props.callback) {
        props.callback(res)
      }
      mobx.resetReply()
      this.setState({
        cw: false,
        expand: false,
        status: '',
        spoiler_text: ''
      })
      this.refTextarea.blur()
    })
  }

  /**
   * @description 如果组件没有被在单独页面使用的话，失去焦点的反应就是切换expand
   * 反之说明在单独页面中使用，则重新触发聚焦
   */
  blurHandler = () => {
    if (!this.props.sendMode) {
      this.setState({ expand: false })
      return
    }
    if (this.refCW && !this.refCW.isFocused()) {
      this.refTextarea.focus()
    }
  }

  render() {
    let inputStyle = {
      ...inputCommonStyle,
      height: 40
    }
    let boxStyle = {
      ...boxCommonStyle,
      height: 140
    }

    if (this.props.sendMode) {
      // 如果组件在发送toot页面单独使用的话，初始化高度设置高点
      inputStyle.height += 180
      boxStyle.height += 150
      boxStyle['borderRadius'] = 5
    }

    if (!this.props.sendMode && this.state.expand) {
      boxStyle.height += 100
      inputStyle.height += 100
    }
    if (this.state.cw) {
      if (this.props.sendMode) {
        inputStyle.height -= 45
      } else {
        boxStyle.height += 45
      }
    }

    let cwElement = null
    if (this.state.cw) {
      cwElement = (
        <TextInput
          ref={ref => (this.refCW = ref)}
          style={{
            ...inputCommonStyle,
            height: 40,
            marginBottom: 5
          }}
          onChangeText={text => this.setState({ spoiler_text: text })}
          value={this.state.spoiler_text}
          maxLength={80}
          placeholder={'折叠部分的警告信息～'}
          onBlur={this.blurHandler}
        />
      )
    }

    return (
      <View style={boxStyle}>
        {!this.props.sendMode && (
          <Text style={{ marginBottom: 5 }}>
            回复
            {mobx.reply_to_username ? '@' + mobx.reply_to_username : ''}
          </Text>
        )}
        {cwElement}
        <TextInput
          ref={ref => (this.refTextarea = ref)}
          autoFocus={this.props.autoFocus}
          style={inputStyle}
          onChangeText={text => mobx.updateInputValue(text)}
          value={mobx.inputValue}
          multiline={true}
          textAlignVertical={'top'}
          placeholder={'-_-'}
          maxLength={400}
          numberOfLines={3}
          onFocus={() => this.setState({ expand: true })}
          onBlur={this.blurHandler}
        />
        <View style={styles.inputTools}>
          <Icon name={'camera'} style={styles.icon} />
          <Icon name={'globe-americas'} style={styles.icon} />
          <TouchableOpacity onPress={this.showCW}>
            <Text style={styles.bold}>CW</Text>
          </TouchableOpacity>
          <Icon name={'grin-squint'} style={styles.icon} />
          <Text style={styles.grey}>{500 - this.state.status.length}</Text>
          <TouchableOpacity style={styles.sendButton} onPress={this.sendToot}>
            <Text style={styles.sendText}>TOOT!</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const boxCommonStyle = {
  borderWidth: 1,
  borderColor: color.lightGrey,
  padding: 10
}

const inputCommonStyle = {
  ...boxCommonStyle,
  borderRadius: 5
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 20
  },
  bold: {
    fontWeight: 'bold'
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: color.headerBg,
    padding: 9,
    borderRadius: 5,
    width: 80
  },
  inputTools: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 55,
    alignItems: 'center'
  },
  grey: {
    color: color.grey
  },
  sendText: {
    fontWeight: 'bold',
    color: color.white
  }
})
