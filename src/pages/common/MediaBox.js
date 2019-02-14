/**
 * 多媒体展示组件
 */

import React, { PureComponent, Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { themeData } from '../../utils/color'
import { Overlay } from 'teaset'
import { observer } from 'mobx-react'
import mobx from '../../utils/mobx'
import PropTypes from 'prop-types'

let color = {}
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

// 多媒体的黑色隐藏框
class BlackMirror extends PureComponent {
  static propTypes = {
    showMedia: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired
  }

  /**
   * @description 根据不同的主题返回不同的敏感内容遮罩颜色
   */
  getCoverColor = () => {
    let coverColor = color.contrastColor
    if (mobx.theme === 'black') {
      coverColor = color.subColor
    }

    return coverColor
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={1} onPress={this.props.showMedia}>
        <View
          style={[
            styles.blackMirror,
            { backgroundColor: this.getCoverColor() }
          ]}
        >
          <Text style={{ color: color.lightThemeColor }}>
            {this.props.text}
          </Text>
          <Text style={{ fontSize: 17, color: color.themeColor }}>
            点击显示
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

class ImageBox extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      image: {}
    }
  }

  componentDidMount() {
    this.setState({
      image: { ...this.props.data }
    })
  }

  shouldComponentUpdate(_, { image }) {
    const currentImage = this.state.image
    if (
      !currentImage ||
      currentImage.id !== image.id ||
      currentImage.hide !== image.hide
    ) {
      return true
    }

    return false
  }

  /**
   * @description 切换媒体文件的显示隐藏状态
   * @param {show}: 显示图片？
   */
  changeMediaStatus = show => {
    this.setState({
      image: { ...this.state.image, hide: show }
    })
  }

  /**
   * @description 预览图片模态框
   * @param {url}: 图片url
   */
  enlargeImage = url => {
    const overlayView = (
      <Overlay.View overlayOpacity={0.9} ref={v => (this.overlayView = v)}>
        <View style={styles.enlargeImageBox}>
          <Image
            style={[styles.enlargeImage, { overlayColor: color.themeColor }]}
            resizeMode={'contain'}
            source={{ uri: url }}
          />
        </View>
      </Overlay.View>
    )
    Overlay.show(overlayView)
  }

  render() {
    const image = this.state.image
    const showMedia = () => this.changeMediaStatus(false)

    if (image.sensitive && image.hide) {
      return (
        <BlackMirror key={image.id} text={'敏感内容'} showMedia={showMedia} />
      )
    } else if (image.hide) {
      return (
        <BlackMirror
          key={image.id}
          text={'隐藏媒体内容'}
          showMedia={showMedia}
        />
      )
    } else {
      return (
        <View key={image.id} style={styles.mediaBox}>
          <View
            zIndex={4}
            style={[styles.eyeSlashBox, { backgroundColor: color.subColor }]}
          >
            <TouchableOpacity onPress={() => this.changeMediaStatus(true)}>
              <Icon
                name={'eye-slash'}
                style={{ fontSize: 14, color: color.themeColor }}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ flex: 1 }}
            onPress={() => this.enlargeImage(image.preview_url)}
          >
            <Image
              source={{ uri: image.preview_url }}
              style={[styles.mediaImage, { overlayColor: color.themeColor }]}
            />
          </TouchableOpacity>
        </View>
      )
    }
  }
}

@observer
export default class MediaBox extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    sensitive: PropTypes.bool.isRequired
  }

  getVideoElement = data => {}

  render() {
    const data = this.props.data
    const sensitive = this.props.sensitive
    color = themeData[mobx.theme]

    if (!data) {
      return <View />
    }
    return (
      <View style={{ flex: 1, marginTop: 10 }}>
        {data.map(media => {
          if (media.type === 'image') {
            return (
              <ImageBox
                key={media.id}
                data={{ ...media, sensitive, hide: sensitive }}
              />
            )
          } else if (media.type === 'video') {
            return this.getVideoElement(media)
          }
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  blackMirror: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 180,
    borderRadius: 5,
    marginBottom: 5
  },
  mediaBox: {
    width: '100%',
    height: 180,
    marginBottom: 5
  },
  eyeSlashBox: {
    position: 'absolute',
    top: 7,
    left: 7,
    width: 23,
    height: 23,
    borderRadius: 5,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mediaImage: {
    flex: 1,
    borderRadius: 5
  },
  enlargeImageBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height
  },
  enlargeImage: {
    width: width,
    height: height
  }
})
