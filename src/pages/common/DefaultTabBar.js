const React = require('react')
const { ViewPropTypes } = (ReactNative = require('react-native'))
const PropTypes = require('prop-types')
const createReactClass = require('create-react-class')
const {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Dimensions
} = ReactNative
import HTMLView from './HTMLView'
const deviceWidth = Dimensions.get('window').width
import { ProfileSpruce } from './Spruce'

const Button = props => {
  return (
    <TouchableNativeFeedback
      delayPressIn={0}
      background={TouchableNativeFeedback.SelectableBackground()} // eslint-disable-line new-cap
      {...props}
    >
      {props.children}
    </TouchableNativeFeedback>
  )
}

const DefaultTabBar = createReactClass({
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    activeTabStyle: PropTypes.object,
    inactiveTextColor: PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: ViewPropTypes.style,
    renderTab: PropTypes.func,
    underlineStyle: ViewPropTypes.style
  },

  getDefaultProps() {
    return {
      activeTextColor: 'navy',
      inactiveTextColor: 'black',
      backgroundColor: null
    }
  },

  renderTabOption(name, page) {},

  renderTab(name, page, isTabActive, onPressHandler) {
    const {
      activeTextColor,
      inactiveTextColor,
      textStyle,
      activeTabStyle
    } = this.props
    const textColor = isTabActive ? activeTextColor : inactiveTextColor
    const theActiveTabStyle = isTabActive ? activeTabStyle : {}
    const fontWeight = isTabActive ? 'bold' : 'normal'

    return (
      <Button
        style={{ flex: 1 }}
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}
      >
        <View style={[styles.tab, this.props.tabStyle]}>
          <Text
            style={[
              { color: textColor, fontWeight },
              textStyle,
              theActiveTabStyle
            ]}
          >
            {name}
          </Text>
        </View>
      </Button>
    )
  },

  render() {
    const containerWidth = this.props.containerWidth
    const numberOfTabs = this.props.tabs.length
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0
    }

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs]
    })
    const profile = this.props.profile || {}
    const color = this.props.color || {}

    return (
      <Animated.View
        style={{
          backgroundColor: color.themeColor,
          height: 500,
          ...this.props.style
        }}
      >
        <View onLayout={this.props.onLayout}>
          {!profile.id ? (
            <ProfileSpruce />
          ) : (
            <View>
              <Image
                source={{ uri: profile.header }}
                style={{
                  width: deviceWidth,
                  height: 155,
                  overlayColor: color.themeColor
                }}
              />
              <View style={{ padding: 15 }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 10,
                    position: 'absolute',
                    left: 15,
                    top: -40,
                    overflow: 'hidden'
                  }}
                >
                  <Image
                    source={{ uri: profile.avatar }}
                    style={{
                      width: 80,
                      height: 80
                    }}
                  />
                </View>
                {this.props.getRelationship(profile)}
                <View>
                  <HTMLView
                    content={profile.display_name}
                    pTagStyle={{
                      color: color.contrastColor,
                      fontWeight: 'bold'
                    }}
                  />
                  <Text
                    style={[styles.userName, { color: color.contrastColor }]}
                  >
                    @{profile.username}
                  </Text>
                </View>
                <HTMLView
                  navigation={this.props.navigation}
                  content={profile.note}
                  pTagStyle={{
                    color: color.contrastColor,
                    fontSize: 14,
                    textAlign: 'center',
                    lineHeight: 18
                  }}
                />
                <View style={styles.followInfoBox}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Followers', {
                        id: profile.id,
                        limit: profile.followers_count
                      })
                    }
                    style={styles.sideInfoBox}
                  >
                    <Text
                      style={[
                        styles.followCount,
                        { color: color.contrastColor }
                      ]}
                    >
                      {profile.followers_count}
                    </Text>
                    <Text style={{ color: color.contrastColor }}>关注者</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Following', {
                        id: profile.id,
                        limit: profile.following_count
                      })
                    }
                    style={styles.insideInfoBox}
                  >
                    <Text
                      style={[
                        styles.followCount,
                        { color: color.contrastColor }
                      ]}
                    >
                      {profile.following_count}
                    </Text>
                    <Text style={{ color: color.contrastColor }}>正在关注</Text>
                  </TouchableOpacity>
                  <View style={styles.insideInfoBox}>
                    <Text
                      style={[
                        styles.followCount,
                        { color: color.contrastColor }
                      ]}
                    >
                      {profile.statuses_count}
                    </Text>
                    <Text style={{ color: color.contrastColor }}>嘟文</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          <View
            style={[
              styles.tabs,
              { backgroundColor: this.props.backgroundColor },
              this.props.tabBarStyle
            ]}
          >
            {this.props.tabs.map((name, page) => {
              const isTabActive = this.props.activeTab === page
              const renderTab = this.props.renderTab || this.renderTab
              return renderTab(name, page, isTabActive, this.props.goToPage)
            })}
            <Animated.View
              style={[
                tabUnderlineStyle,
                {
                  transform: [{ translateX }]
                },
                this.props.underlineStyle
              ]}
            />
          </View>
        </View>
      </Animated.View>
    )
  }
})

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc'
  },
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

module.exports = DefaultTabBar
