import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Header, Left, Body, Right, Button, Title, Spinner } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { getStatuses, context } from '../utils/api'
import { color } from '../utils/color'
import Context from './common/Context'
import ReplyInput from './common/ReplyInput'

/**
 * Toot详情页面
 */
export default class TootDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toot: null,
      context: null,
      ancestors: [],
      descendants: [],
      refreshing: false
    }
  }

  componentDidMount() {
    const toot = this.props.navigation.getParam('data')
    // 设置为主体内容，这样详情页面展示的时候就会使用主体组件而不是评论组件
    toot['isMaster'] = true
    const id = toot.id

    this.setState({
      toot: toot,
      refreshing: false
    })
    this.getContext(id)
  }

  fetchData = () => {
    this.setState({
      refreshing: true,
      toot: null
    })

    const toot = this.props.navigation.getParam('data')
    const id = toot.id

    getStatuses(id).then(res => {
      this.setState({
        toot: res,
        refreshing: false
      })
    })

    this.getContext(id)
  }

  getContext = id => {
    context(id).then(res => {
      this.setState(res)
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

  render() {
    const toot = this.state.toot
    const ancestors = this.state.ancestors
    const descendants = this.state.descendants

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

    if (!toot) {
      return (
        <View style={styles.container}>
          {headerElement}
          <Spinner style={{ marginTop: 250 }} color={color.themeColor} />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        {headerElement}
        <View style={{ flex: 1 }}>
          <Context
            data={[...ancestors, toot, ...descendants]}
            navigation={this.props.navigation}
          />
        </View>
        <ReplyInput
          tootId={toot.id}
          appendReply={data =>
            this.setState({
              descendants: [...descendants, data]
            })
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },
  icon: {
    fontSize: 15
  },
  navIcon: {
    fontSize: 20,
    color: color.white
  }
})
