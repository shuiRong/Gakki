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
import globe from '../../utils/store'

@observer
export default class ReplyInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: '',
      spoiler_text: '', // 警告消息，警告前方可能出现的特殊内容
      expand: false, // 输入框是否展开成多行？
      cw: false // Content Warning 模式是否开启
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
      in_reply_to_id: props.tootId,
      status: state.status,
      spoiler_text: state.cw ? state.spoiler_text : '',
      visibility: 'public',
      sensitive: false
    }).then(res => {
      props.appendReply(res)
      this.setState({
        cw: false,
        expand: false,
        status: '',
        spoiler_text: ''
      })
      props.scrollToEnd()
    })
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
    if (this.state.expand) {
      boxStyle.height += 100
      inputStyle.height += 100
    }
    if (this.state.cw) {
      boxStyle.height += 50
    }

    let cwElement = null
    if (this.state.cw) {
      cwElement = (
        <TextInput
          style={{
            ...inputCommonStyle,
            height: 40,
            marginBottom: 5
          }}
          onChangeText={text => this.setState({ spoiler_text: text })}
          value={this.state.spoiler_text}
          maxLength={80}
          placeholder={'折叠部分的警告信息～'}
        />
      )
    }

    return (
      <View style={boxStyle}>
        <Text style={{ marginBottom: 5 }}>回复@QQQ@cmx.im</Text>
        {cwElement}
        <TextInput
          style={inputStyle}
          onChangeText={text => this.setState({ status: text })}
          value={this.state.status}
          multiline={true}
          textAlignVertical={'top'}
          placeholder={'-_-'}
          maxLength={400}
          numberOfLines={3}
          onFocus={() => this.setState({ expand: true })}
          onBlur={() => this.setState({ expand: false })}
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
  borderColor: '#ddd',
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
    backgroundColor: '#307FF0',
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
    color: 'grey'
  },
  sendText: {
    fontWeight: 'bold',
    color: 'white'
  }
})
