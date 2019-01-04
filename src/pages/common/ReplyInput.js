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
import { Menu } from 'teaset'

// 嘟文可见范围的图标与实际字段的对应关系
const visibilityDict = {
  'globe-americas': 'public',
  unlock: 'unlisted',
  lock: 'private',
  envelope: 'direct'
}

@observer
export default class ReplyInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expand: false, // 输入框是否展开成多行？
      whichIsFocused: '', // 当前哪个输入框被触发了
      visibilityIcon: 'globe-americas' // 当前选择的嘟文公开选项的图标名称
    }
  }

  sendToot = () => {
    const props = this.props

    sendStatuses({
      in_reply_to_id: mobx.in_reply_to_id,
      status: mobx.inputValue,
      spoiler_text: mobx.cw ? mobx.spoiler_text : '',
      visibility: visibilityDict[this.state.visibilityIcon],
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
        expand: false
      })
      this.refTextarea.blur()
    })
  }

  // 显示嘟文可见范围的选项菜单
  showOptions = () => {
    const getTitle = (title, subTitle, iconName) => {
      if (this.state.visibilityIcon === iconName) {
        return (
          <View>
            <Text style={[styles.title, styles.highlight]}>{title}</Text>
            <Text style={[styles.subTitle, styles.highlight]}>{subTitle}</Text>
          </View>
        )
      }

      return (
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>
      )
    }
    const getIcon = name => {
      if (this.state.visibilityIcon === name) {
        return <Icon name={name} style={[styles.menuIcon, styles.highlight]} />
      }
      return <Icon name={name} style={styles.menuIcon} />
    }

    const items = [
      {
        title: getTitle(
          '公开',
          '所有人可见，并会出现在公共时间轴上',
          'globe-americas'
        ),
        icon: getIcon('globe-americas'),
        onPress: () => this.changeOption('globe-americas')
      },
      {
        title: getTitle(
          '不公开',
          '所有人可见，但不会出现在公共时间轴上',
          'unlock'
        ),
        icon: getIcon('unlock'),
        onPress: () => this.changeOption('unlock')
      },
      {
        title: getTitle('仅关注者', '只有关注你的用户能看到', 'lock'),
        icon: getIcon('lock'),
        onPress: () => this.changeOption('lock')
      },
      {
        title: getTitle('私信', '只有被提及的用户能看到', 'envelope'),
        icon: getIcon('envelope'),
        onPress: () => this.changeOption('envelope')
      }
    ]

    this.refOption.measureInWindow((x, y, width, height) => {
      Menu.show({ x: x + 10, y, width, height }, items, {
        popoverStyle: {
          backgroundColor: color.white,
          justifyContent: 'center',
          elevation: 10
        },
        direction: 'up'
      })
    })
  }

  changeOption = visibilityIcon => {
    this.setState({
      visibilityIcon
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
    if (mobx.cw) {
      if (this.props.sendMode) {
        inputStyle.height -= 45
      } else {
        boxStyle.height += 45
      }
    }

    let cwElement = null
    if (mobx.cw) {
      cwElement = (
        <TextInput
          ref={ref => (this.refCW = ref)}
          style={{
            ...inputCommonStyle,
            height: 40,
            marginBottom: 5
          }}
          onChangeText={text => mobx.updateSpoilerText(text)}
          value={mobx.spoiler_text}
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
          <TouchableOpacity onPress={this.showOptions}>
            <Icon name={this.state.visibilityIcon} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            ref={ref => (this.refOption = ref)}
            onPress={() => mobx.exchangeCW()}
          >
            {mobx.cw ? (
              <Text style={styles.enableCW}>CW</Text>
            ) : (
              <Text style={styles.disenableCW}>CW</Text>
            )}
          </TouchableOpacity>
          <Icon name={'grin-squint'} style={styles.icon} />
          <Text style={styles.grey}>{500 - mobx.inputValue.length}</Text>
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
  disenableCW: {
    fontWeight: 'bold'
  },
  enableCW: {
    fontWeight: 'bold',
    color: color.headerBg
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
  },
  title: {
    color: color.moreBlack,
    fontWeight: 'bold'
  },
  subTitle: {
    color: color.grey,
    fontSize: 10
  },
  menuIcon: {
    fontSize: 15,
    marginRight: 10
  },
  highlight: {
    color: color.headerBg
  }
})
