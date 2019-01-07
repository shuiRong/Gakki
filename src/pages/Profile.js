import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {
  favourite,
  reblog,
  mute,
  getAccountData,
  getRelationship
} from '../utils/api'
import ScrollableTabView, {
  DefaultTabBar
} from 'react-native-scrollable-tab-view'
import TootScreen from './screen/TootScreen'
import MediaScreen from './screen/MediaScreen'
import Fab from './common/Fab'
import { color } from '../utils/color'
import { fetch } from '../utils/store'
import HTMLView from './common/HTMLView'

/**
 * Toot详情页面
 */
let deviceHeight = require('Dimensions').get('window').height
export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profile: {},
      relationship: {},
      headerTop: new Animated.Value(0),
      emojiObj: {}
    }
  }

  componentWillMount() {
    this.animatedEvent = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: { y: this.state.headerTop }
          }
        }
      ],
      {
        listener: (event, gestureState) =>
          console.log(event, gestureState, event.nativeEvent.contentOffset.y)
      }
    )

    const headerTop = this.state.headerTop

    this.distanceFromTop = headerTop.interpolate({
      inputRange: [0, 800, 801, 802],
      outputRange: [0, -370, -370, -370]
    })

    this.opacity = headerTop.interpolate({
      inputRange: [0, 456, 690, 691, 692],
      outputRange: [0, 0, 1, 1, 1]
    })
  }

  componentDidMount() {
    const id = this.props.navigation.getParam('id')
    this.getAccountData(id)
    this.getRelationship(id)
    fetch('emojiObj').then(res => {
      if (!res) {
        return
      }
      this.setState({
        emojiObj: res
      })
    })
  }

  /**
   * @description 获取用户个人详情
   * @param {id}: id
   */
  getAccountData = id => {
    getAccountData(id).then(res => {
      this.setState({
        profile: res
      })
    })
  }

  /**
   * @description 获取你与该用户的关系数据
   * @param {id}: id
   */
  getRelationship = id => {
    getRelationship(id).then(res => {
      this.setState({
        relationship: res[0]
      })
    })
  }

  /**
   * @description 给toot点赞，如果已经点过赞就取消点赞
   */
  favourite = () => {
    favourite(this.state.toot.id, this.state.toot.favourited).then(() => {
      this.update('favourited', 'favourites_count')
    })
  }

  /**
   * @description 转发toot
   */
  reblog = () => {
    reblog(this.state.toot.id, this.state.toot.reblogged).then(() => {
      this.update('reblogged', 'reblogs_count')
    })
  }

  /**
   * @description 更改前端点赞和转发的状态值，并且增减数量
   * @param {status}: 状态名 favourited/reblogged
   * @param {statusCount}: 状态的数量key
   */
  update = (status, statusCount) => {
    const value = this.state.toot[status]
    const newToot = { ...this.state.toot }
    newToot[status] = !value
    if (value) {
      newToot[statusCount] -= 1
    } else {
      newToot[statusCount] += 1
    }
    this.setState({
      toot: newToot
    })
  }

  /**
   * @description 隐藏某人，不看所有动态
   */
  mute = () => {
    mute(this.state.toot.id, this.state.toot.muted).then(() => {
      this.goBackWithParam()
    })
  }

  /**
   * @description 回到主页，带着一些可能变化的数据
   */
  goBackWithParam = () => {
    this.props.navigation.navigate('Home', {
      data: {
        id: this.state.toot.id,
        accountId: this.state.toot.account.id,
        reblogged: this.state.toot.reblogged,
        reblogs_count: this.state.toot.reblogs_count,
        favourited: this.state.toot.favourited,
        favourites_count: this.state.toot.favourites_count,
        muted: this.state.toot.muted
      }
    })
  }

  /**
   * @description 返回是否已经关注对方的Element
   */
  getRelationshop = () => {
    let configStyle = {
      backgroundColor: color.headerBg,
      iconName: 'user',
      iconColor: color.white,
      text: '已关注',
      textColor: color.white
    }
    if (!this.state.relationship.following) {
      configStyle = {
        backgroundColor: color.white,
        iconName: 'user-plus',
        iconColor: color.headerBg,
        text: '关注',
        textColor: color.headerBg
      }
    }

    return (
      <View
        style={{
          ...styles.followButton,
          backgroundColor: configStyle.backgroundColor
        }}
      >
        <Icon
          name={configStyle.iconName}
          style={{
            fontSize: 20,
            color: configStyle.iconColor,
            marginRight: 10
          }}
        />
        <Text style={{ color: configStyle.textColor }}>{configStyle.text}</Text>
      </View>
    )
  }

  render() {
    const state = this.state
    const profile = state.profile

    return (
      <View style={styles.contianer}>
        <View style={styles.header}>
          <Animated.View
            scrollEventThrottle={20}
            style={{
              ...styles.headerStyle,
              opacity: this.opacity
            }}
          >
            <View style={styles.headerView}>
              <HTMLView
                data={profile.display_name}
                emojiObj={state.emojiObj}
                pTagStyle={{ color: color.white, fontWeight: 'bold' }}
              />
              <Text numberOfLines={1} style={styles.headerUserName}>
                &nbsp;@{profile.username}
              </Text>
            </View>
          </Animated.View>
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon style={styles.navIcon} name="arrow-left" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginRight: 20 }}>
            <Icon style={styles.navIcon} name="ellipsis-v" />
          </TouchableOpacity>
        </View>
        <Animated.View
          scrollEventThrottle={20}
          style={{
            top: this.distanceFromTop
          }}
        >
          <ImageBackground source={{ uri: profile.header }} style={styles.bg}>
            <View style={styles.bgBox}>
              <View style={styles.avatarBox}>
                <Image source={{ uri: profile.avatar }} style={styles.image} />
                <HTMLView
                  data={profile.display_name}
                  emojiObj={state.emojiObj}
                  pTagStyle={{ color: color.white }}
                />
                <Text style={styles.userName}>@{profile.username}</Text>
                <TouchableOpacity>{this.getRelationshop()}</TouchableOpacity>
              </View>
              <HTMLView
                data={profile.note}
                emojiObj={state.emojiObj}
                pTagStyle={{
                  color: color.white,
                  fontSize: 11,
                  textAlign: 'center',
                  lineHeight: 13
                }}
              />
              <View style={styles.followInfoBox}>
                <View style={styles.sideInfoBox}>
                  <Text style={styles.followCount}>
                    {profile.followers_count}
                  </Text>
                  <Text style={{ color: color.white }}>关注者</Text>
                </View>
                <View style={styles.insideInfoBox}>
                  <Text style={styles.followCount}>
                    {profile.following_count}
                  </Text>
                  <Text style={{ color: color.white }}>正在关注</Text>
                </View>
                <View style={styles.insideInfoBox}>
                  <Text style={styles.followCount}>
                    {profile.statuses_count}
                  </Text>
                  <Text style={styles.white}>嘟文</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
        <Animated.View
          scrollEventThrottle={20}
          style={{
            height: deviceHeight,
            top: this.distanceFromTop
          }}
        >
          <ScrollableTabView
            initialPage={0}
            renderTabBar={() => (
              <DefaultTabBar
                backgroundColor={color.white}
                activeTextColor={color.headerBg}
                underlineStyle={{ backgroundColor: color.headerBg }}
              />
            )}
          >
            <TootScreen
              tabLabel={'嘟文'}
              onScroll={this.animatedEvent}
              navigation={this.props.navigation}
            />
            <MediaScreen
              tabLabel={'媒体'}
              onScroll={this.animatedEvent}
              navigation={this.props.navigation}
            />
          </ScrollableTabView>
        </Animated.View>
        <Fab navigation={this.props.navigation} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
    backgroundColor: color.white
  },
  body: {
    flexDirection: 'column'
  },
  bg: {
    width: '100%',
    height: 370
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 50,
    marginBottom: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1
  },
  followButton: {
    width: 100,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 5
  },
  time: {
    alignSelf: 'flex-start',
    color: color.grey,
    fontSize: 15,
    marginTop: 20
  },
  leftBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  navIcon: {
    fontSize: 20,
    color: color.white
  },
  bottomText: {
    marginLeft: 10
  },
  headerStyle: {
    backgroundColor: color.headerBg,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 50,
    zIndex: -1,
    justifyContent: 'center'
  },
  headerView: {
    marginLeft: 50,
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
    overflow: 'hidden'
  },
  headerUserName: {
    color: color.lightGrey,
    fontSize: 14
  },
  bgBox: {
    flex: 1,
    margin: 10,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  avatarBox: {
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userName: {
    color: color.lightGrey,
    fontSize: 14,
    marginBottom: 5
  },
  followInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    justifyContent: 'space-around'
  },
  insideInfoBox: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  followCount: {
    color: color.white,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center'
  },
  white: {
    color: color.white
  }
})
