import React, { Component } from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
  Content,
  Text,
  Card,
  CardItem,
  Thumbnail
} from 'native-base'
import Ripple from 'react-native-material-ripple'
import Icon from 'react-native-vector-icons/FontAwesome'
import { getStatuses } from '../utils/api'
import HTML from 'react-native-render-html'
import moment from 'moment'

/**
 * Toot详情页面
 */
export default class TootDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toot: {
        id: '101250996662871740',
        created_at: '2018-12-16T13:40:00.450Z',
        in_reply_to_id: null,
        in_reply_to_account_id: null,
        sensitive: false,
        spoiler_text: '',
        visibility: 'public',
        language: 'zh-CN',
        uri: 'https://cmx.im/users/shuiRong/statuses/101250996662871740',
        content: '<p>测试</p>',
        url: 'https://cmx.im/@shuiRong/101250996662871740',
        replies_count: 0,
        reblogs_count: 0,
        favourites_count: 0,
        favourited: false,
        reblogged: false,
        muted: false,
        pinned: false,
        reblog: null,
        application: {
          name: 'Web',
          website: null
        },
        account: {
          id: '81232',
          username: 'shuiRong',
          acct: 'shuiRong',
          display_name: '',
          locked: false,
          bot: false,
          created_at: '2018-12-05T06:13:24.519Z',
          note: '<p></p>',
          url: 'https://cmx.im/@shuiRong',
          avatar:
            'https://cmx.im/system/accounts/avatars/000/081/232/original/6fde03bb798bd111.jpg?1544620479',
          avatar_static:
            'https://cmx.im/system/accounts/avatars/000/081/232/original/6fde03bb798bd111.jpg?1544620479',
          header:
            'https://cmx.im/system/accounts/headers/000/081/232/original/f6d371ea63e221e1.jpeg?1544620479',
          header_static:
            'https://cmx.im/system/accounts/headers/000/081/232/original/f6d371ea63e221e1.jpeg?1544620479',
          followers_count: 0,
          following_count: 2,
          statuses_count: 2,
          emojis: [],
          fields: []
        },
        media_attachments: [],
        mentions: [],
        tags: [],
        emojis: [],
        card: null
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

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon
                style={[styles.icon, styles.navIcon]}
                name="arrow-left"
                onPress={() => this.props.navigation.goBack()}
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
              <HTML
                html={this.state.toot.content}
                tagsStyles={tagsStyles}
                imagesMaxWidth={Dimensions.get('window').width}
              />
              <Text style={styles.time}>
                {moment(this.state.toot.created_at).format('LLL')}
              </Text>
            </CardItem>
            <CardItem>
              <Left style={styles.leftBody}>
                <Button transparent>
                  <Icon style={styles.icon} active name="reply" />
                  <Text>12</Text>
                </Button>
                <Button transparent>
                  <Icon style={styles.icon} active name="retweet" />
                  <Text>5</Text>
                </Button>
                <Button transparent>
                  <Icon style={styles.icon} active name="star" />
                  <Text>4</Text>
                </Button>
              </Left>
              <Right>
                <Icon style={styles.icon} name="ellipsis-h" />
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
    alignItems: 'center'
  },
  icon: {
    fontSize: 17
  },
  navIcon: {
    fontSize: 20,
    color: '#fff'
  }
})
