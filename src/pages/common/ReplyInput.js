import React, { Component } from 'react'
import { observer } from 'mobx-react'
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Button
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { sendStatuses, upload } from '../../utils/api'
import mobx from '../../utils/mobx'
import { color } from '../../utils/color'
import { Menu, Overlay, Input } from 'teaset'
import ImagePicker from 'react-native-image-picker'

const width = Dimensions.get('window').width
// 嘟文可见范围的图标与实际字段的对应关系
const visibilityDict = {
  'globe-americas': 'public',
  unlock: 'unlisted',
  lock: 'private',
  envelope: 'direct'
}

class UploadMedia extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: null,
      description: '123'
    }
    this.refMedia = {} // 存储几个媒体文件的ref引用
  }

  componentDidMount() {
    this.setState({
      list: this.props.data
    })
  }

  componentWillReceiveProps({ data }) {
    this.setState({
      list: data
    })
  }

  // 调用传入的修改描述信息函数，并且将数据置空
  setDescription = index => {
    this.props.setDescription(index, this.state.description)
    this.overlayView.close()
  }

  beforeShowDescriptionInput = index => {
    this.setState(
      {
        description: this.state.list[index].description
      },
      () => {
        console.log(222, this.state)
        this.showDescriptionInput(index)
      }
    )
  }

  showDescriptionInput = index => {
    let overlayView = (
      <Overlay.View
        modal={true}
        overlayOpacity={0.5}
        ref={v => (this.overlayView = v)}
        style={styles.descriptionOverlay}
      >
        <View style={styles.descriptionInputBox}>
          <Input
            autoFocus={true}
            placeholder={'为视觉障碍人士添加文字说明...'}
            multiline={true}
            numberOfLines={3}
            textAlignVertical={'top'}
            style={{
              width: '100%',
              height: 80,
              textAlign: 'left',
              borderWidth: 0,
              borderBottomWidth: 1,
              borderBottomColor: color.headerBg
            }}
            // value={this.state.description}
            onChangeText={text => this.setState({ description: text })}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 20,
              alignSelf: 'flex-end',
              width: '50%'
            }}
          >
            <TouchableOpacity
              onPress={() => this.overlayView && this.overlayView.close()}
            >
              <Text
                style={{ color: color.grey, fontSize: 15, fontWeight: 'bold' }}
              >
                取消
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setDescription(index)}>
              <Text
                style={{
                  color: color.headerBg,
                  fontSize: 15,
                  fontWeight: 'bold'
                }}
              >
                确定
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay.View>
    )
    Overlay.show(overlayView)
  }

  /**
   * @description 显示媒体文件的选择项
   * @param {index}: 当前点击的是第几个媒体文件
   */
  showMediaOption = index => {
    const getTitle = title => {
      return <Text style={styles.title}>{title}</Text>
    }
    const getIcon = name => {
      return <Icon name={name} style={styles.menuIcon} />
    }

    const items = [
      {
        title: getTitle('辅助标题'),
        icon: getIcon('accessible-icon'),
        onPress: () => this.beforeShowDescriptionInput(index)
      },
      {
        title: getTitle('移除'),
        icon: getIcon('trash'),
        onPress: () => this.props.removeMedia(index)
      }
    ]

    this.refMedia[index].measureInWindow((x, y, width, height) => {
      Menu.show({ x, y: y - 5, width, height }, items, {
        popoverStyle: {
          backgroundColor: color.white,
          justifyContent: 'center',
          elevation: 10
        },
        direction: 'up'
      })
    })
  }

  render() {
    const state = this.state
    if (!state.list) {
      return null
    }
    return (
      <View
        style={{
          position: 'absolute',
          left: 15,
          bottom: 8,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-start'
        }}
      >
        {state.list.map((image, index) => (
          <TouchableOpacity
            key={image.uri}
            ref={ref => (this.refMedia[index] = ref)}
            activeOpacity={0.9}
            onPress={() => this.showMediaOption(index)}
          >
            <Image
              style={{ width: width / 6, height: width / 6, marginRight: 15 }}
              resizeMode={'contain'}
              key={image.uri}
              source={image}
            />
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

@observer
export default class ReplyInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expand: false, // 输入框是否展开成多行？
      whichIsFocused: '', // 当前哪个输入框被触发了
      visibilityIcon: 'globe-americas', // 当前选择的嘟文公开选项的图标名称
      avatarSource: {
        uri: ''
      },
      mediaList: [
        {
          uri:
            'https://avatar-static.segmentfault.com/192/301/1923018619-58ca23464841a_huge256'
        },
        {
          uri:
            'https://avatar-static.segmentfault.com/170/179/1701793266-5b5586b258f8b_big64'
        },
        {
          uri:
            'https://avatar-static.segmentfault.com/192/301/1923018619-58ca23464841a_huge256'
        },
        {
          uri:
            'https://avatar-static.segmentfault.com/170/179/1701793266-5b5586b258f8b_big64'
        }
      ]
    }
  }

  componentDidMount() {
    // this.pickImage()
  }

  pickImage = () => {
    // More info on all the options is below in the API Reference... just some common use cases shown here
    const options = {
      title: '选择图片',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '从相册中选择',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response)

      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else {
        const source = { uri: response.uri }

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        })
        upload({
          response: response,
          description: 'description',
          focus: 'focus'
        }).then(res => {
          console.log('upload res', res)
        })
      }
    })
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

  removeMedia = mediaIndex => {
    this.setState({
      mediaList: this.state.mediaList.filter((_, index) => index !== mediaIndex)
    })
  }

  setDescription = (mediaIndex, description) => {
    const newList = [...this.state.mediaList]
    newList.forEach((media, index) => {
      if (index === mediaIndex) {
        media['description'] = description
      }
      return media
    })
    this.setState({
      mediaList: newList
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
    const state = this.state

    let inputStyle = {
      ...inputCommonStyle,
      height: 40,
      paddingBottom: width / 5
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
        <View>
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
          <UploadMedia
            data={state.mediaList}
            removeMedia={this.removeMedia}
            setDescription={this.setDescription}
          />
        </View>

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
    marginRight: 10,
    color: color.lightBlack
  },
  highlight: {
    color: color.headerBg
  },
  descriptionInputBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 50,
    height: 170,
    backgroundColor: color.white,
    borderRadius: 5,
    padding: 20
  },
  descriptionOverlay: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})
