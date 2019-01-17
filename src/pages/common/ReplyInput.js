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
  Animated,
  Easing,
  FlatList
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {
  sendStatuses,
  upload,
  updateMedia,
  getCustomEmojis
} from '../../utils/api'
import mobx from '../../utils/mobx'
import { color } from '../../utils/color'
import { Menu, Overlay, Input } from 'teaset'
import ImagePicker from 'react-native-image-picker'
import { save, fetch } from '../../utils/store'

const width = Dimensions.get('window').width
// 嘟文可见范围的图标与实际字段的对应关系
const visibilityDict = {
  'globe-americas': 'public',
  unlock: 'unlisted',
  lock: 'private',
  envelope: 'direct'
}

class EmojiBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
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

  render() {
    const state = this.state
    if (!state.list.length) {
      return null
    }
    return (
      <FlatList
        style={styles.emojiFlatList}
        numColumns={8}
        showsVerticalScrollIndicator={false}
        data={state.list}
        keyExtractor={item => item.shortcode}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ margin: 3 }}
            onPress={() => mobx.addInputValue(`:${item.shortcode}: `)}
          >
            <Image
              style={styles.emojiImage}
              source={{ uri: item.static_url }}
            />
          </TouchableOpacity>
        )}
      />
    )
  }
}

class UploadMedia extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: null,
      description: ''
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
            maxLength={20}
            numberOfLines={3}
            textAlignVertical={'top'}
            style={styles.descriptionInput}
            // value={this.state.description}
            onChangeText={text => this.setState({ description: text })}
          />
          <View style={styles.descriptionButtonBox}>
            <TouchableOpacity
              onPress={() => this.overlayView && this.overlayView.close()}
            >
              <Text style={styles.descriptionText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setDescription(index)}>
              <Text
                style={{
                  ...styles.descriptionText,
                  color: color.themeColor
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
    if (!state.list || !state.list.length) {
      return null
    }
    return (
      <View style={styles.mediaBox}>
        {state.list.map((image, index) => (
          <TouchableOpacity
            key={image.uri}
            ref={ref => (this.refMedia[index] = ref)}
            activeOpacity={0.9}
            onPress={() => this.showMediaOption(index)}
          >
            <Image
              style={styles.mediaFile}
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
      mediaList: [],
      rotateValue: new Animated.Value(0),
      stopRotate: true,
      customEmojis: [],
      emojiBoxIsShown: false // 显示emojiBox吗？
    }
  }

  componentWillMount() {
    this.spin = this.state.rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
  }

  componentDidMount() {
    fetch('emojis').then(res => {
      if (res && res.length) {
        this.setState({
          customEmojis: res
        })
        return
      }

      // 如果之前没有存储，从网络获取
      this.getCustomEmojis()
    })
  }

  /**
   * @description 从网络重新获取emojis数据
   */
  getCustomEmojis = () => {
    getCustomEmojis().then(res => {
      this.setState({
        customEmojis: res
      })
      save('emojis', res)
      // 另外，转换emojis Array数据为Object数据，留作后面HTML渲染时用
      this.translateEmoji()
    })
  }

  translateEmoji = emojis => {
    const emojiObj = {}
    emojis.forEach(item => {
      emojiObj[item.shortcode] = item.static_url
    })

    save('emojiObj', emojiObj)
  }

  pickImage = () => {
    const options = {
      title: '选择图片',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '从相册中选择',
      cancelButtonTitle: '取消',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    ImagePicker.showImagePicker(options, response => {
      // 开始旋转～
      this.setState({
        stopRotate: false
      })
      this.startRotate()

      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else {
        upload({
          response: response,
          description: 'description',
          focus: 'focus'
        })
          .then(res => {
            this.setState({
              mediaList: [...this.state.mediaList].concat({
                uri: res.preview_url,
                id: res.id
              }),
              stopRotate: true
            })
          })
          .catch(() => {
            this.setState({
              stopRotate: true
            })
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
      sensitive: false,
      media_ids: this.state.mediaList.map(media => media.id)
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
        expand: false,
        mediaList: []
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
        updateMedia(media.id, {
          description
        }).then(() => {
          // 更新媒体文件辅助标题参数
        })
      }
      return media
    })
    this.setState({
      mediaList: newList
    })
  }

  /**
   * @description 如果组件没有被在单独页面使用的话，失去焦点的反应就是切换expand
   */
  blurHandler = () => {
    if (!this.props.sendMode) {
      this.setState({ expand: false })
      return
    }
  }

  /**
   * @description blur输入框，隐藏软键盘，显示emoji
   */
  showEmojiBox = () => {
    this.refTextarea && this.refTextarea.blur()
    this.refCW && this.refCW.blur()
    this.setState({
      emojiBoxIsShown: !this.state.emojiBoxIsShown
    })
  }

  emojiBoxIsShown = () => {
    if (!this.state.emojiBoxIsShown) {
      return null
    }
    return <EmojiBox data={this.state.customEmojis} />
  }

  /**
   * @description 旋转相机图标，表示正在上传文件
   */
  startRotate = () => {
    this.state.rotateValue.setValue(0)
    const rotate = Animated.timing(this.state.rotateValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear
    })
    if (!this.state.stopRotate) {
      rotate.start(() => this.startRotate())
    }
  }

  // 根据文件是否在上传返回不同的图标
  getMediaIcon = () => {
    return (
      <TouchableOpacity onPress={this.pickImage}>
        {this.state.stopRotate ? (
          <Icon name={'camera'} style={styles.icon} />
        ) : (
          <Animated.View
            style={{
              transform: [
                {
                  rotate: this.spin
                }
              ]
            }}
          >
            <Icon name={'sync-alt'} style={styles.syncIcon} />
          </Animated.View>
        )}
      </TouchableOpacity>
    )
  }

  render() {
    const state = this.state

    let inputStyle = {
      ...inputCommonStyle,
      height: 40
    }
    let boxStyle = {
      ...boxCommonStyle,
      height: 140
    }

    // 如果存在媒体文件才增加paddingBottom
    if (state.mediaList.length) {
      inputStyle['paddingBottom'] = width / 5

      // 如果非发嘟页面且用户上传了媒体文件，那么input和box都增高些
      if (!this.props.sendMode) {
        inputStyle.height += 70
        boxStyle.height += 70
      }
    }

    if (this.props.sendMode) {
      // 如果组件在发送toot页面单独使用的话，初始化高度设置高点
      inputStyle.height += 180
      boxStyle.height += 150
      boxStyle['borderRadius'] = 5
    }

    if (!this.props.sendMode) {
      boxStyle['borderTopWidth'] = 0.5
      if (state.expand) {
        boxStyle.height += 60
        inputStyle.height += 60
      }
      // 如果不是发嘟页面并且显示emoji
      if (state.emojiBoxIsShown) {
        boxStyle.height += 120
      }
    } else {
      // 如果是发嘟页面，且显示emoji
      if (state.emojiBoxIsShown) {
        boxStyle.height += 240
      }
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
          onFocus={() =>
            this.setState({
              emojiBoxIsShown: false
            })
          }
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
            placeholder={'在想啥？'}
            maxLength={500}
            numberOfLines={3}
            onFocus={() =>
              this.setState({ expand: true, emojiBoxIsShown: false })
            }
            onBlur={this.blurHandler}
          />
          <UploadMedia
            data={state.mediaList}
            removeMedia={this.removeMedia}
            setDescription={this.setDescription}
          />
        </View>
        <View style={styles.inputTools}>
          {this.getMediaIcon()}
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
          <TouchableOpacity onPress={this.showEmojiBox}>
            {state.emojiBoxIsShown ? (
              <Icon
                name={'grin-squint'}
                style={[styles.icon, styles.highlight]}
              />
            ) : (
              <Icon name={'grin-squint'} style={styles.icon} />
            )}
          </TouchableOpacity>
          <Text style={styles.grey}>{500 - mobx.inputValue.length}</Text>
          <TouchableOpacity style={styles.sendButton} onPress={this.sendToot}>
            <Text style={styles.sendText}>TOOT!</Text>
          </TouchableOpacity>
        </View>
        {this.emojiBoxIsShown()}
      </View>
    )
  }
}

const boxCommonStyle = {
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
    color: color.themeColor
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: color.themeColor,
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
    color: color.themeColor
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
  },
  descriptionInput: {
    width: '100%',
    height: 80,
    textAlign: 'left',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: color.themeColor
  },
  descriptionButtonBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    alignSelf: 'flex-end',
    width: '50%'
  },
  descriptionText: {
    color: color.grey,
    fontSize: 15,
    fontWeight: 'bold'
  },
  mediaBox: {
    position: 'absolute',
    left: 15,
    bottom: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  mediaFile: {
    width: width / 6,
    height: width / 6,
    marginRight: 15
  },
  syncIcon: {
    color: color.themeColor,
    fontSize: 18
  },
  emojiFlatList: {
    flex: 1,
    alignSelf: 'center'
  },
  emojiImage: {
    width: (width - 50) / 9.5,
    height: (width - 50) / 9.5
  }
})
