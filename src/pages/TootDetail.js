import React, { Component } from 'react'
import { View, StyleSheet, RefreshControl } from 'react-native'
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
  Content,
  Spinner
} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { getStatuses, context } from '../utils/api'
import { color } from '../utils/color'
import Context from './common/Context'
import ReplyInput from './common/ReplyInput'
import globe from '../utils/mobx'
import TootBox from './common/TootBox'

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
      context: [],
      refreshing: false
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.setState({
      refreshing: true,
      toot: {
        account: {}
      }
    })
    const id = this.props.navigation.getParam('id')
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

  renderMenu = ref => {}

  scrollToEnd = () => {
    this.contentRef._root.scrollToEnd({ animated: true })
  }

  render() {
    const toot = this.state.toot
    const context = this.state.context

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

    if (!toot.id) {
      return (
        <Container>
          {headerElement}
          <Spinner style={{ marginTop: 250 }} color={color.headerBg} />
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
          <TootBox
            data={toot.reblog || toot}
            navigation={this.props.navigation}
          />
          <View
            style={{ borderTopColor: color.lightGrey, borderTopWidth: 1 }}
          />
          <Context data={context} />
        </Content>
        <ReplyInput
          tootId={toot.id}
          appendReply={data =>
            this.setState({
              context: [...context, data]
            })
          }
          scrollToEnd={this.scrollToEnd}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 15
  },
  navIcon: {
    fontSize: 20,
    color: color.white
  }
})
