import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'native-base'
import Header from './common/Header'
import Loading from './common/Loading'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { context } from '../utils/api'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import Context from './common/Context'
import ReplyInput from './common/ReplyInput'
import { observer } from 'mobx-react'
import { CancelToken } from 'axios'

/**
 * Toot详情页面
 */
let color = {}
@observer
export default class TootDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toot: null,
      ancestors: [],
      descendants: []
    }

    this.cancel = []
  }

  componentDidMount() {
    this.init(this.props.navigation.getParam('data'))
  }

  /**
   * @description 页面初始化时需要加载的数据
   * @param {toot}: 路由过来时附带的数据
   */
  init = toot => {
    // 设置为主体内容，这样详情页面展示的时候就会使用主体组件而不是评论组件
    toot['isMaster'] = true
    const id = toot.id

    this.setState({
      toot: toot,
      ancestors: [],
      descendants: []
    })
    this.getContext(id)
  }

  componentWillReceiveProps({ navigation }) {
    this.init(navigation.getParam('data'))
  }

  componentWillUnmount() {
    this.cancel.forEach(cancel => cancel && cancel())
  }

  getContext = id => {
    context(mobx.domain, id, {
      cancelToken: new CancelToken(c => this.cancel.push(c))
    }).then(res => {
      if (!res.ancestors.length && !res.descendants.length) {
        return
      }
      this.setState({
        ancestors: res.ancestors,
        descendants: res.descendants
      })
    })
  }

  /**
   * @description 回到主页，带着一些可能变化的数据
   * @param {mute} 隐藏某人动态
   */
  goBackWithParam = () => {
    this.props.navigation.navigate('Home', {
      data: {
        id: this.state.toot.id,
        accountId: this.state.toot.account.id,
        reblogged: this.state.toot.reblogged,
        reblogs_count: this.state.toot.reblogs_count,
        favourited: this.state.toot.favourited,
        favourites_count: this.state.toot.favourites_count
        // mute: mute
      }
    })
  }

  render() {
    const toot = this.state.toot
    const ancestors = this.state.ancestors
    const descendants = this.state.descendants
    color = themeData[mobx.theme]

    const headerElement = (
      <Header
        left={
          <Button transparent>
            <Icon
              style={[styles.icon, { color: color.subColor }]}
              name={'arrow-left'}
              onPress={this.goBackWithParam}
            />
          </Button>
        }
        title={'嘟文'}
        right={'none'}
      />
    )

    if (!toot) {
      return (
        <View style={{ flex: 1, backgroundColor: color.themeColor }}>
          {headerElement}
          <Loading />
        </View>
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: color.themeColor }}>
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
  icon: {
    fontSize: 17
  }
})
