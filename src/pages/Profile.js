import React, { Component } from 'react'
import {
  Text,
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity
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
  Thumbnail
} from 'native-base'
import Ripple from 'react-native-material-ripple'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { getStatuses, favourite, reblog, mute } from '../utils/api'
import HTML from 'react-native-render-html'
import moment from 'moment'
// import RNPopoverMenu from 'react-native-popover-menu'

/**
 * Toot详情页面
 */
export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toot: {
        account: {}
      }
    }
  }

  componentDidMount() {
    getStatuses(this.props.navigation.getParam('id')).then(res => {
      this.setState({
        toot: res
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
    //     }
    //   },
    //   onCancel: () => {}
    // })
  }

  render() {
    return (
      <Container ref={this.detail}>
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
            <Title>Header</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon style={[styles.icon, styles.navIcon]} name="ellipsis-h" />
            </Button>
          </Right>
        </Header>
        <Content padder>
          <Card transparent>
            <CardItem>
              <Left>
                <Thumbnail source={{ uri: this.state.toot.account.avatar }} />
                <Body>
                  <Text>
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
                  {moment(this.state.toot.created_at).format('LLL')}
                </Text>
              </Ripple>
            </CardItem>
            <CardItem style={{ marginTop: 10 }}>
              <View style={styles.leftBody}>
                <Button transparent>
                  <Icon name="reply" />
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
                    <Icon name="retweet" />
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
                    <Icon name="star" />
                  )}
                  <Text style={styles.bottomText}>
                    {this.state.toot.favourites_count}
                  </Text>
                </Button>
              </View>
              <Right>
                <TouchableOpacity
                  ref={ref => {
                    this.ref = ref
                  }}
                  onPress={() => {
                    this.renderMenu(this.ref)
                  }}
                >
                  <Icon name="ellipsis-h" />
                </TouchableOpacity>
              </Right>
            </CardItem>
          </Card>
        </Content>
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
  leftBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  icon: {
    fontSize: 17
  },
  navIcon: {
    fontSize: 20,
    color: '#fff'
  },
  bottomText: {
    marginLeft: 10
  }
})
