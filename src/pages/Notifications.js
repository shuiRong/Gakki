import React, { Component } from 'react'
import { Text, Dimensions, StyleSheet } from 'react-native'
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
        id: '101252461973606017',
        created_at: '2018-12-16T19:52:39.346Z',
        in_reply_to_id: null,
        in_reply_to_account_id: null,
        sensitive: false,
        spoiler_text: '',
        visibility: 'unlisted',
        language: 'zh',
        uri: 'https://pawoo.net/users/lilythepooh/statuses/101252461973606017',
        content:
          '<p>不是等一下《理查三世》得怎么排才跟这个海报搭配啊，我的猎奇心理突然出现。<br />（是的我还检查了好几遍写的不是理查二世（。</p>',
        url: 'https://pawoo.net/@lilythepooh/101252461973606017',
        reblogs_count: 0,
        favourites_count: 0,
        pixiv_cards: [],
        pinned: false,
        favourited: false,
        reblogged: false,
        muted: false,
        reblog: null,
        application: {
          name: 'Web',
          website: null
        },
        account: {
          id: '499931',
          username: 'lilythepooh',
          acct: 'lilythepooh',
          display_name: '阿柴lilythepooh',
          locked: false,
          bot: false,
          created_at: '2017-09-24T14:26:21.361Z',
          note:
            '<p>中文/English/un peu Français Whovian/Theatre/Mamma Mia/Elisabeth/Winnie the Pooh/Paddington/1789:LAdB/Blur/Suede/theTears/Postmodern Jukebox/1920s fashion/cuisine</p>',
          url: 'https://pawoo.net/@lilythepooh',
          avatar:
            'https://img.pawoo.net/accounts/avatars/000/499/931/original/b944e4145b53161e.jpeg',
          avatar_static:
            'https://img.pawoo.net/accounts/avatars/000/499/931/original/b944e4145b53161e.jpeg',
          header:
            'https://img.pawoo.net/accounts/headers/000/499/931/original/9e58fd774dcbc1a5.png',
          header_static:
            'https://img.pawoo.net/accounts/headers/000/499/931/original/9e58fd774dcbc1a5.png',
          followers_count: 302,
          following_count: 109,
          statuses_count: 6869,
          emojis: [],
          oauth_authentications: [],
          fields: []
        },
        media_attachments: [
          {
            id: '10460839',
            type: 'image',
            url:
              'https://img.pawoo.net/media_attachments/files/010/460/839/original/83675d740a96376c.png',
            preview_url:
              'https://img.pawoo.net/media_attachments/files/010/460/839/small/83675d740a96376c.png',
            remote_url: null,
            text_url: 'https://pawoo.net/media/aivwGsdCK8RyXfiHobo',
            meta: {
              focus: {
                x: 0.01,
                y: 0.6
              },
              original: {
                width: 640,
                height: 1136,
                size: '640x1136',
                aspect: 0.5633802816901409
              },
              small: {
                width: 225,
                height: 400,
                size: '225x400',
                aspect: 0.5625
              }
            },
            description: null
          }
        ],
        mentions: [],
        tags: [],
        emojis: []
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
            <CardItem>
              <Left style={styles.leftBody}>
                <Button transparent>
                  <Icon style={styles.icon} name="reply" />
                  <Text style={styles.bottomText}>
                    {this.state.toot.replies_count}
                  </Text>
                </Button>
                <Button transparent>
                  <Icon style={styles.icon} name="retweet" />
                  <Text style={styles.bottomText}>
                    {this.state.toot.reblogs_count}
                  </Text>
                </Button>
                <Button transparent>
                  <Icon style={styles.icon} name="star" />
                  <Text style={styles.bottomText}>
                    {this.state.toot.favourites_count}
                  </Text>
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
  },
  bottomText: {
    marginLeft: 10
  }
})