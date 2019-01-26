import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
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
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import HTMLView from './common/HTMLView'
import { observer } from 'mobx-react'

/**
 * Toot详情页面
 */
let deviceHeight = require('Dimensions').get('window').height
let color = {}
@observer
export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profile: {},
      relationship: {},
      headerTop: new Animated.Value(0)
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
      outputRange: [0, -470, -470, -470]
    })

    this.opacity = headerTop.interpolate({
      inputRange: [0, 456, 690, 691, 692],
      outputRange: [0, 0, 1, 1, 1]
    })

    this.colorInterpolate = headerTop.interpolate({
      inputRange: [0, 456, 690, 691],
      outputRange: [
        color.themeColor,
        color.themeColor,
        color.subColor,
        color.subColor
      ]
    })
  }

  componentDidMount() {
    const id = this.props.navigation.getParam('id')
    // const id = '81232'
    this.getAccountData(id)
    this.getRelationship(id)
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
    getRelationship([id]).then(res => {
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
   * @description 返回是否已经关注对方的relationship
   */
  getRelationshop = profile => {
    let configStyle = {
      backgroundColor: color.contrastColor,
      iconName: 'user',
      iconColor: color.themeColor,
      text: '已关注',
      textColor: color.themeColor
    }
    if (!this.state.relationship.following) {
      configStyle = {
        backgroundColor: color.contrastColor,
        iconName: 'user-plus',
        iconColor: color.themeColor,
        text: '关注',
        textColor: color.themeColor
      }
    }

    // 如果是自己的个人页面
    if (profile.id === mobx.account.id) {
      return <View style={{ height: 43 }} />
    }

    return (
      <View
        style={{
          ...styles.followButton,
          backgroundColor: configStyle.backgroundColor,
          alignSelf: 'flex-end'
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
    color = themeData[mobx.theme]

    return (
      <View style={{ flex: 1, backgroundColor: color.themeColor }}>
        <View style={styles.header}>
          <Animated.View
            scrollEventThrottle={20}
            style={{
              backgroundColor: color.themeColor,
              color: color.contrastColor,
              ...styles.headerStyle,
              opacity: this.opacity
            }}
          >
            <View style={styles.headerView}>
              <HTMLView
                data={profile.display_name}
                pTagStyle={{ color: color.contrastColor, fontWeight: 'bold' }}
              />
              <Text
                numberOfLines={1}
                style={{ fontSize: 14, color: color.contrastColor }}
              >
                &nbsp;@{profile.username}
              </Text>
            </View>
          </Animated.View>
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon
              style={{ fontSize: 20, color: color.subColor }}
              name="arrow-left"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => alert('v1')}
          >
            <Icon
              style={{ fontSize: 20, color: color.subColor }}
              name="ellipsis-v"
            />
          </TouchableOpacity>
        </View>
        <Animated.View
          scrollEventThrottle={20}
          style={{
            top: this.distanceFromTop
          }}
        >
          <Image
            source={{ uri: profile.header }}
            style={{ width: '100%', height: 155 }}
          />
          <View style={{ padding: 15 }}>
            <Image
              source={{ uri: profile.avatar }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 5,
                position: 'absolute',
                left: 15,
                top: -40
              }}
            />
            {this.getRelationshop(profile)}
            <View>
              <HTMLView
                data={profile.display_name}
                pTagStyle={{ color: color.contrastColor, fontWeight: 'bold' }}
              />
              <Text style={[styles.userName, { color: color.contrastColor }]}>
                @{profile.username}
              </Text>
            </View>
            <HTMLView
              navigation={this.props.navigation}
              data={profile.note}
              pTagStyle={{
                color: color.contrastColor,
                fontSize: 14,
                textAlign: 'center',
                lineHeight: 18
              }}
            />
            <View style={styles.followInfoBox}>
              <View style={styles.sideInfoBox}>
                <Text
                  style={[styles.followCount, { color: color.contrastColor }]}
                >
                  {profile.followers_count}
                </Text>
                <Text style={{ color: color.contrastColor }}>关注者</Text>
              </View>
              <View style={styles.insideInfoBox}>
                <Text
                  style={[styles.followCount, { color: color.contrastColor }]}
                >
                  {profile.following_count}
                </Text>
                <Text style={{ color: color.contrastColor }}>正在关注</Text>
              </View>
              <View style={styles.insideInfoBox}>
                <Text
                  style={[styles.followCount, { color: color.contrastColor }]}
                >
                  {profile.statuses_count}
                </Text>
                <Text style={{ color: color.contrastColor }}>嘟文</Text>
              </View>
            </View>
          </View>
        </Animated.View>
        <Animated.View
          scrollEventThrottle={20}
          style={{
            height: deviceHeight + 200,
            top: this.distanceFromTop
          }}
        >
          <ScrollableTabView
            initialPage={0}
            renderTabBar={() => (
              <DefaultTabBar
                backgroundColor={color.themeColor}
                activeTextColor={color.contrastColor}
                inactiveTextColor={color.subColor}
                underlineStyle={{ backgroundColor: color.contrastColor }}
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
  body: {
    flexDirection: 'column'
  },
  bg: {
    width: '100%',
    height: 200
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
  leftBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bottomText: {
    marginLeft: 10
  },
  headerStyle: {
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
    fontSize: 14,
    marginBottom: 5
  },
  followInfoBox: {
    marginTop: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    width: '70%',
    justifyContent: 'space-around'
  },
  insideInfoBox: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  followCount: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center'
  }
})
