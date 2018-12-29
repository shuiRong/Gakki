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
import globe from '../utils/mobx'
import jstz from 'jstz'
import { zh } from '../utils/locale'
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
                  {momentTimezone(this.state.toot.created_at)
                    .tz(this.state.timezone)
                    .format('LLL')}
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
