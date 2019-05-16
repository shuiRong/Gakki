import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {
  favourite,
  reblog,
  mute,
  getAccountData,
  getRelationship,
  follow
} from '../utils/api'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import DefaultTabBar from './common/DefaultTabBar'
import TootScreen from './screen/TootScreen'
import MediaScreen from './screen/MediaScreen'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import HTMLView from './common/HTMLView'
import { observer } from 'mobx-react'
import { CancelToken } from 'axios'

/**
 * Toot详情页面
 */
const deviceWidth = Dimensions.get('window').width
let currentTab = 0
let color = {}
@observer
export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profile: {},
      relationship: {},
      headerTop: new Animated.Value(0),
      loading: true,
      tabBarHeight: 500
    }

    this.cancel = []
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
        listener: e => {
          mobx.updateEnabled(e.nativeEvent.contentOffset.y == 0)
        }
      }
    )

    const headerTop = this.state.headerTop

    this.distanceFromTop = headerTop.interpolate({
      inputRange: [0, this.state.tabBarHeight],
      outputRange: [0, -this.state.tabBarHeight],
      extrapolate: 'clamp'
    })

    this.opacity = headerTop.interpolate({
      inputRange: [0, this.state.tabBarHeight],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })
  }

  componentDidMount() {
    this.fetchData()
  }

  componentWillUnmount() {
    this.cancel.forEach(cancel => cancel && cancel())
  }

  fetchData = data => {
    const id = data || this.props.navigation.getParam('id')
    this.getAccountData(id)
    this.getRelationship(id)
  }

  componentWillReceiveProps({ navigation }) {
    this.fetchData(navigation.getParam('id'))
  }

  /**
   * @description 获取用户个人详情
   * @param {id}: id
   */
  getAccountData = id => {
    getAccountData(mobx.domain, id, {
      cancelToken: new CancelToken(c => this.cancel.push(c))
    })
      .then(res => {
        this.setState({
          profile: res,
          loading: false
        })
      })
      .catch(() => {
        this.setState({
          loading: false
        })
      })
  }

  /**
   * @description 获取你与该用户的关系数据
   * @param {id}: id
   */
  getRelationship = id => {
    getRelationship(mobx.domain, [id], {
      cancelToken: new CancelToken(c => this.cancel.push(c))
    }).then(res => {
      this.setState({
        relationship: res[0]
      })
    })
  }

  /**
   * @description 给toot点赞，如果已经点过赞就取消点赞
   */
  favourite = () => {
    favourite(mobx.domain, this.state.toot.id, this.state.toot.favourited, {
      cancelToken: new CancelToken(c => this.cancel.push(c))
    }).then(() => {
      this.update('favourited', 'favourites_count')
    })
  }

  /**
   * @description 转发toot
   */
  reblog = () => {
    reblog(mobx.domain, this.state.toot.id, this.state.toot.reblogged, {
      cancelToken: new CancelToken(c => this.cancel.push(c))
    }).then(() => {
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
    mute(this.state.toot.id, this.state.toot.muted, {
      cancelToken: new CancelToken(c => this.cancel.push(c))
    }).then(() => {
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
   * @description 关注或者取关用户
   * @param {following}: 正在关注该用户
   */
  followTheAccount = following => {
    follow(mobx.domain, this.state.profile.id, !following, {
      cancelToken: new CancelToken(c => this.cancel.push(c))
    }).then(res => {
      this.setState({
        relationship: res
      })
    })
  }

  refreshHandler = () => {
    this.setState({
      loading: true,
      profile: {},
      relationship: {}
    })
    this.fetchData()
    if (currentTab === 0) {
      this.ref1.refreshHandler()
      return
    }
    this.ref2.refreshHandler()
  }

  /**
   * @description 返回是否已经关注对方的relationship
   */
  getRelationshipElement = profile => {
    let configStyle = {
      backgroundColor: color.contrastColor,
      iconName: 'user',
      iconColor: color.themeColor,
      text: '已关注',
      textColor: color.themeColor
    }

    const relationship = this.state.relationship
    const following = relationship.following
    if (!following) {
      configStyle = {
        backgroundColor: color.contrastColor,
        iconName: 'user-plus',
        iconColor: color.themeColor,
        text: '关注',
        textColor: color.themeColor
      }
    }

    const requested = relationship.requested
    if (requested) {
      configStyle = {
        backgroundColor: color.contrastColor,
        iconName: 'hourglass-half',
        iconColor: color.themeColor,
        text: '请求中',
        textColor: color.themeColor
      }
    }

    // 如果是自己的个人页面
    if (profile.id === mobx.account.id) {
      return <View style={{ height: 43 }} />
    }

    return (
      <TouchableOpacity
        onPress={() => this.followTheAccount(following)}
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
      </TouchableOpacity>
    )
  }

  getHeader = profile => {
    if (!profile) {
      return null
    }

    return (
      <TouchableOpacity
        onPress={() => mobx.profileTabRef.scrollToOffset({ offset: 0 })}
        style={styles.header}
      >
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: deviceWidth * 0.7,
                overflow: 'hidden'
              }}
            >
              <HTMLView
                content={profile.display_name || ''}
                pTagStyle={{
                  color: color.contrastColor,
                  fontWeight: 'bold',
                  maxWidth: deviceWidth * 0.5,
                  overflow: 'hidden'
                }}
              />
              <Text
                numberOfLines={1}
                style={{
                  marginLeft: 20,
                  fontSize: 14,
                  color: color.contrastColor,
                  textAlignVertical: 'top'
                }}
              >
                &nbsp;@{profile.username}
              </Text>
            </View>
            <View style={styles.headerAvatar}>
              <Image
                source={{ uri: profile.avatar }}
                style={styles.headerAvatar}
              />
            </View>
          </View>
        </Animated.View>
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => this.props.navigation.goBack()}
        >
          <Icon
            style={{ fontSize: 20, color: color.subColor }}
            name={'arrow-left'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  render() {
    const state = this.state
    const profile = state.profile
    color = themeData[mobx.theme]

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            enabled={mobx.enabled}
            refreshing={state.loading}
            onRefresh={this.refreshHandler}
          />
        }
        contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1, backgroundColor: color.themeColor }}
      >
        {this.getHeader(profile)}
        <ScrollableTabView
          initialPage={0}
          onChangeTab={({ i }) => {
            currentTab = i
          }}
          renderTabBar={() => (
            <DefaultTabBar
              profile={profile}
              color={color}
              navigation={this.props.navigation}
              getRelationship={this.getRelationshipElement}
              backgroundColor={color.themeColor}
              activeTextColor={color.contrastColor}
              activeTabStyle={{ fontSize: 20 }}
              inactiveTextColor={color.subColor}
              underlineStyle={{ backgroundColor: 'transparent' }}
              style={{
                position: 'absolute',
                top: this.distanceFromTop,
                left: 0,
                height: state.tabBarHeight,
                zIndex: 100
              }}
              tabBarStyle={{ borderColor: 'transparent' }}
              onLayout={e => {
                this.setState({
                  tabBarHeight: e.nativeEvent.layout.height
                })
              }}
            />
          )}
        >
          <TootScreen
            ref={ref => (this.ref1 = ref)}
            style={{ paddingTop: state.tabBarHeight }}
            tabLabel={'嘟文'}
            onScroll={this.animatedEvent}
            navigation={this.props.navigation}
          />
          <MediaScreen
            ref={ref => (this.ref2 = ref)}
            style={{ paddingTop: state.tabBarHeight }}
            tabLabel={'媒体'}
            onScroll={this.animatedEvent}
            navigation={this.props.navigation}
          />
        </ScrollableTabView>
      </ScrollView>
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
    zIndex: 200
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
    width: '82%',
    overflow: 'hidden',
    justifyContent: 'space-between'
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
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 5,
    overflow: 'hidden'
  }
})
