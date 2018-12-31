/**
 * 多媒体展示组件
 */

import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { color } from '../../utils/color'

// 多媒体的黑色隐藏框
class BlackMirror extends Component {
  render() {
    return (
      <TouchableOpacity activeOpacity={1} onPress={this.props.showMedia}>
        <View style={styles.blackMirror}>
          <Text style={styles.sensitiveText}>{this.props.text}</Text>
          <Text style={styles.sensitiveSubText}>点击显示</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

class ImageBox extends Component {
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

  /**
   * @description 切换媒体文件的显示隐藏状态
   * @param {show}: 显示图片？
   */
  changeMediaStatus = show => {
    this.setState({
      image: { ...this.state.image, hide: show }
    })
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
          <View zIndex={4} style={styles.eyeSlashBox}>
            <TouchableOpacity onPress={() => this.changeMediaStatus(true)}>
              <Icon name={'eye-slash'} style={styles.eyeSlashIcon} />
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: image.preview_url }}
            style={styles.mediaImage}
          />
        </View>
      )
    }
  }
}

export default class MediaBox extends Component {
  getVideoElement = data => {}

  render() {
    const data = this.props.data
    const sensitive = this.props.sensitive

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
    backgroundColor: color.black,
    justifyContent: 'center',
    alignItems: 'center',
    height: 180,
    borderRadius: 5,
    marginBottom: 5
  },
  sensitiveText: {
    fontSize: 15,
    color: color.lightBlack
  },
  sensitiveSubText: {
    color: color.lightBlack
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
    backgroundColor: color.moreBlack,
    justifyContent: 'center',
    alignItems: 'center'
  },
  eyeSlashIcon: {
    fontSize: 14,
    color: color.white
  },
  mediaImage: {
    flex: 1,
    borderRadius: 5
  }
})
