import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Button } from 'native-base'
import { favourite, reblog } from '../../utils/api'
import momentTimezone from 'moment-timezone'
import HTML from 'react-native-render-html'
import jstz from 'jstz'
import { RelativeTime } from 'relative-time-react-native-component'
import { zh } from '../../utils/locale'
import MediaBox from './MediaBox'

export default class TootBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timezone: jstz.determine().name(), // 获得当前用户所在的时区
      locale: zh,
      toot: null
    }
  }

  componentDidMount() {
    this.setState({
      toot: this.props.data
    })
  }

  componentWillReceiveProps({ data }) {
    this.setState({
      toot: data
    })
  }

  /**
   * @description 给toot点赞，如果已经点过赞就取消点赞
   * @param {id}: id
   * @param {favourited}: 点赞状态
   */
  favourite = (id, favourited) => {
    favourite(id, favourited).then(() => {
      this.update(id, 'favourited', favourited, 'favourites_count')
    })
  }

  /**
   * @description 转发toot
   * @param {id}: id
   * @param {reblogged}: 转发状态
   */
  reblog = (id, reblogged) => {
    reblog(id, reblogged).then(() => {
      this.update(id, 'reblogged', reblogged, 'reblogs_count')
    })
  }

  /**
   * @description 更改前端点赞和转发的状态值，并且增减数量
   * @param {status}: 状态名 favourited/reblogged
   * @param {value}: 状态值 true/false
   * @param {statusCount}: 状态的数量key
   */
  update = (id, status, value, statusCount) => {
    const newList = [...this.state.list]
    newList.forEach(list => {
      if (list.id === id) {
        list[status] = !value
        if (value) {
          list[statusCount] -= 1
        } else {
          list[statusCount] += 1
        }
      }
    })
    this.setState({
      list: newList
    })
  }

  /**
   * 跳转入Toot详情页面
   */
  goTootDetail = id => {
    if (!this.props) {
      return
    }
    this.props.navigation.navigate('TootDetail', {
      id: id
    })
  }

  /**
   * @description 跳转入个人详情页面
   * @param {id}: id
   */
  goProfile = id => {
    if (!this.props) {
      return
    }
    this.props.navigation.navigate('Profile', {
      id: id
    })
  }

  getTimeValue = time => {
    return new Date(
      momentTimezone(time)
        .tz(this.state.timezone)
        .format()
    ).valueOf()
  }

  render() {
    const data = this.state.toot
    if (!data) {
      return <View />
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.goProfile(data.account.id)}
        >
          <Image style={styles.avatar} source={{ uri: data.account.avatar }} />
        </TouchableOpacity>
        <View style={styles.list}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.goTootDetail(data.id)}
          >
            <View style={styles.row}>
              <Text numberOfLines={1} style={styles.titleWidth}>
                <Text style={styles.displayName}>
                  {data.account.display_name || data.account.username}
                </Text>
                <Text style={styles.smallGrey}>
                  &nbsp;@{data.account.username}
                </Text>
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'right'
                }}
              >
                <RelativeTime
                  locale={this.state.locale}
                  time={this.getTimeValue(data.created_at)}
                />
              </Text>
            </View>
            <View style={styles.htmlBox}>
              <HTML
                html={data.content}
                tagsStyles={tagsStyles}
                imagesMaxWidth={Dimensions.get('window').width}
              />
            </View>
            <MediaBox
              data={data.media_attachments}
              sensitive={data.sensitive}
            />
            <View style={styles.iconBox}>
              <Button
                transparent
                onPress={() =>
                  this.props.navigation.navigate('Reply', {
                    id: data.id
                  })
                }
              >
                <Icon style={styles.icon} name="reply" />
                <Text style={styles.bottomText}>{data.replies_count}</Text>
              </Button>
              <Button
                transparent
                onPress={() => this.reblog(data.id, data.reblogged)}
              >
                {data.reblogged ? (
                  <Icon
                    style={{ ...styles.icon, color: '#ca8f04' }}
                    name="retweet"
                  />
                ) : (
                  <Icon style={styles.icon} name="retweet" />
                )}
                <Text style={styles.bottomText}>{data.reblogs_count}</Text>
              </Button>
              <Button
                transparent
                onPress={() => this.favourite(data.id, data.favourited)}
              >
                {data.favourited ? (
                  <Icon
                    style={{ ...styles.icon, color: '#ca8f04' }}
                    name="star"
                    solid
                  />
                ) : (
                  <Icon style={styles.icon} name="star" />
                )}
                <Text style={styles.bottomText}>{data.favourites_count}</Text>
              </Button>
              <Button transparent>
                <Icon style={styles.icon} name="ellipsis-h" />
              </Button>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const tagsStyles = {
  p: {
    color: '#2b2e3d',
    fontSize: 16,
    lineHeight: 20
  },
  a: {
    lineHeight: 20
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    marginTop: 15
  },
  list: {
    alignItems: 'stretch',
    flex: 1
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  smallGrey: {
    color: 'grey',
    fontWeight: 'normal'
  },
  titleWidth: {
    width: 170,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  displayName: {
    color: '#333'
  },
  iconBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flex: 1
  },
  htmlBox: {
    flex: 1,
    marginTop: 10,
    marginRight: 20
  },
  icon: {
    fontSize: 15
  },
  bottomText: {
    marginLeft: 10
  },
  divider: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderBottomWidth: 0
  }
})
