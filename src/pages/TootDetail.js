import React, { Component } from 'react'
import {
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Spinner
} from 'native-base'
import Ripple from 'react-native-material-ripple'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {
  getStatuses,
  favourite,
  reblog,
  muteAccount,
  context,
  blockAccount
} from '../utils/api'
import HTML from 'react-native-render-html'

// import RNPopoverMenu from 'react-native-popover-menu'
import Context from './common/Context'
import ReplyInput from './common/ReplyInput'
import { contextData, tootDetail } from '../mock'
import globe from '../utils/mobx'
import jstz from 'jstz'
import momentTimezone from 'moment-timezone'

/**
 * Toot详情页面
 */
export default class TootDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toot: {
        account: {}
      },
      timezone: jstz.determine().name(), // 获得当前用户所在的时区
      context: [],
      refreshing: false
    }
  }

  componentDidMount() {
    this.fetchData()
    // 使用模拟数据
    // this.setState({
    //   toot: tootDetail,
    //   context: contextData
    // })
  }

  fetchData = () => {
    this.setState({
      refreshing: true,
      toot: {
        account: {}
      }
    })
    const id = this.props.navigation.getParam('id')
    // const id = '101273579009552513'
    getStatuses(id).then(res => {
      this.setState({
        toot: res,
        refreshing: false
      })

      globe.updateReply(res.account.id, res.account.username)
    })

    context(id).then(res => {
      this.setState({
        context: res.descendants
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
    muteAccount(this.state.toot.account.id, true).then(() => {
      this.goBackWithParam(true)
    })
  }

  /**
   * @description 屏蔽某人
   */
  block = () => {
    blockAccount(this.state.toot.account.id, true).then(() => {
      this.goBackWithParam(true)
    })
  }

  /**
   * @description 回到主页，带着一些可能变化的数据
   * @param {mute} 隐藏某人动态
   */
  goBackWithParam = mute => {
    this.props.navigation.navigate('Home', {
      data: {
        id: this.state.toot.id,
        accountId: this.state.toot.account.id,
        reblogged: this.state.toot.reblogged,
        reblogs_count: this.state.toot.reblogs_count,
        favourited: this.state.toot.favourited,
        favourites_count: this.state.toot.favourites_count,
        mute: mute
      }
    })
  }

  renderMenu = ref => {
    let menus = [
      {
        menus: [{ label: '隐藏' }, { label: '屏蔽' }]
      }
    ]

    // RNPopoverMenu.Show(ref, {
    //   menus: menus,
    //   onDone: (sectionSelection, menuIndex) => {
    //     if (menuIndex === 0) {
    //       this.mute()
    //     } else if (menuIndex === 1) {
    //       this.block()
    //     }
    //   },
    //   onCancel: () => {}
    // })
  }

  scrollToEnd = () => {
    this.contentRef._root.scrollToEnd({ animated: true })
  }

  render() {
    const headerElement = (
      <Header>
        <Left>
          <Button transparent>
            <Icon
              style={[styles.icon, styles.navIcon]}
              name="arrow-left"
              onPress={this.goBackWithParam}
            />
          </Button>
        </Left>
        <Body>
          <Title>嘟文</Title>
        </Body>
        <Right>
          <Button transparent>
            <Icon style={[styles.icon, styles.navIcon]} name="ellipsis-h" />
          </Button>
        </Right>
      </Header>
    )

    if (!this.state.toot.id) {
      return (
        <Container>
          {headerElement}
          <Spinner style={{ marginTop: 250 }} color="#5067FF" />
        </Container>
      )
    }

    return (
      <Container>
        {headerElement}
        <Content
          ref={ref => (this.contentRef = ref)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.fetchData}
            />
          }
          padder
        >
          <Card transparent>
            <CardItem>
              <Left>
                <Thumbnail source={{ uri: this.state.toot.account.avatar }} />
                <Body>
                  <Text style={styles.black}>
                    {this.state.toot.account.display_name ||
                      this.state.toot.account.username}
                  </Text>
                  <Text note>{this.state.toot.account.username}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody style={styles.body}>
              <Ripple>
                <HTML
                  html={this.state.toot.content}
                  tagsStyles={tagsStyles}
                  imagesMaxWidth={Dimensions.get('window').width}
                />
                <Text style={styles.time}>
                  {momentTimezone(this.state.toot.created_at)
                    .tz(this.state.timezone)
                    .format('LLL')}
                </Text>
              </Ripple>
            </CardItem>
            <CardItem style={styles.tools}>
              <Left style={styles.leftIcon}>
                <Button transparent>
                  <Icon name="reply" style={styles.icon} />
                  <Text style={styles.bottomText}>
                    {this.state.toot.replies_count}
                  </Text>
                </Button>
                <Button transparent onPress={this.reblog}>
                  {this.state.toot.reblogged ? (
                    <Icon
                      style={{ ...styles.icon, color: '#ca8f04' }}
                      name="retweet"
                    />
                  ) : (
                    <Icon name="retweet" style={styles.icon} />
                  )}
                  <Text style={styles.bottomText}>
                    {this.state.toot.reblogs_count}
                  </Text>
                </Button>
                <Button transparent onPress={this.favourite}>
                  {this.state.toot.favourited ? (
                    <Icon
                      style={{ ...styles.icon, color: '#ca8f04' }}
                      name="star"
                      solid
                    />
                  ) : (
                    <Icon name="star" style={styles.icon} />
                  )}
                  <Text style={styles.bottomText}>
                    {this.state.toot.favourites_count}
                  </Text>
                </Button>
              </Left>
              <Right>
                <TouchableOpacity
                  ref={ref => {
                    this.ref = ref
                  }}
                  onPress={() => {
                    this.renderMenu(this.ref)
                  }}
                >
                  <Icon name="ellipsis-h" style={styles.icon} />
                </TouchableOpacity>
              </Right>
            </CardItem>
          </Card>
          <Context data={this.state.context} />
        </Content>
        <ReplyInput
          tootId={this.state.toot.id}
          appendReply={data =>
            this.setState({
              context: [...this.state.context, data]
            })
          }
          scrollToEnd={this.scrollToEnd}
        />
      </Container>
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
  body: {
    flexDirection: 'column'
  },
  time: {
    alignSelf: 'flex-start',
    color: 'grey',
    fontSize: 15,
    marginTop: 20
  },
  leftIcon: {
    width: 500,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  icon: {
    fontSize: 15
  },
  navIcon: {
    fontSize: 20,
    color: '#fff'
  },
  bottomText: {
    marginLeft: 10
  },
  black: {
    color: 'black'
  },
  tools: {
    height: 40,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    marginTop: 10,
    alignItems: 'center'
  }
})
