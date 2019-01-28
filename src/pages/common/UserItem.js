import React, { Component } from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { muteAccount, blockAccount, checkRequest } from '../../utils/api'
import { themeData } from '../../utils/color'
import mobx from '../../utils/mobx'
import HTMLView from './HTMLView'
import { observer } from 'mobx-react'

let color = {}
@observer
export default class UserList extends Component {
  static defaultProps = {
    model: '' // 当前组件使用的模式，模式不同展示的右侧图标不同
  }

  constructor(props) {
    super(props)
    this.state = {
      account: {},
      relationship: {}
    }
  }

  componentDidMount() {
    const props = this.props
    this.setState({
      account: props.data,
      relationship: props.relationship
    })
  }

  componentWillReceiveProps({ data, relationship }) {
    this.setState({
      account: data,
      relationship
    })
  }

  /**
   * @description 是否隐藏、取消隐藏账号
   */
  blockAccount = block => {
    const state = this.state
    const id = state.account.id
    blockAccount(id, block).then(() => {
      if (!block) {
        this.props.deleteUser(id)
        return
      }
    })
  }

  /**
   * @description 是否隐藏、取消隐藏账号
   */
  muteAccount = (mute, notification) => {
    const state = this.state
    const id = state.account.id
    muteAccount(id, mute, notification).then(() => {
      if (!mute) {
        this.props.deleteUser(id)
        return
      }
      this.setState({
        relationship: {
          ...state.relationship,
          muting_notifications: notification
        }
      })
    })
  }

  checkRequest = status => {
    const id = this.state.account.id
    checkRequest(id, status).then(() => {
      this.props.deleteUser(id)
    })
  }

  /**
   * @description 获取右侧图标
   */
  getRightIcon = () => {
    const model = this.props.model
    const relationship = this.state.relationship
    if (!model) {
      return null
    } else if (model === 'request') {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this.checkRequest(false)}
        >
          <Icon
            name={'times'}
            style={{
              fontSize: 18,
              color: color.contrastColor,
              marginRight: 15
            }}
          />
        </TouchableOpacity>
      )
    } else if (model === 'block') {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this.blockAccount(false)}
        >
          <Icon
            name={'unlock'}
            style={{ fontSize: 18, color: color.contrastColor }}
          />
        </TouchableOpacity>
      )
    }

    // mute页面的话
    return relationship.muting_notifications ? (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => this.muteAccount(true, false)}
      >
        <Icon
          name={'bell'}
          style={{ fontSize: 18, color: color.contrastColor }}
        />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => this.muteAccount(true, true)}
      >
        <Icon
          name={'bell-slash'}
          style={{ fontSize: 18, color: color.contrastColor }}
        />
      </TouchableOpacity>
    )
  }

  getLeftIcon = () => {
    const model = this.props.model
    if (!model) {
      return null
    } else if (model === 'request') {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this.checkRequest(true)}
        >
          <Icon
            name={'check'}
            style={{
              fontSize: 18,
              color: color.contrastColor,
              marginRight: 15
            }}
          />
        </TouchableOpacity>
      )
    } else if (model === 'mute') {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this.muteAccount(false)}
        >
          <Icon
            name={'volume-up'}
            style={{
              fontSize: 18,
              color: color.contrastColor,
              marginRight: 15
            }}
          />
        </TouchableOpacity>
      )
    }
  }

  render() {
    const state = this.state
    const account = state.account
    color = themeData[mobx.theme]

    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          paddingLeft: 15,
          paddingRight: 15,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            this.props.navigation.navigate('Profile', {
              id: account.id
            })
          }}
        >
          <Image
            source={{ uri: account.avatar }}
            style={{ width: 40, height: 40, borderRadius: 5, marginRight: 5 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ width: '65%' }}
          activeOpacity={0.5}
          onPress={() =>
            this.props.navigation.navigate('Profile', {
              id: account.id
            })
          }
        >
          <HTMLView data={account.display_name || account.username} />
          <Text>@{account.username}</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '18%'
          }}
        >
          {this.getLeftIcon()}

          <View
            style={{
              width: '60%',
              alignItems: 'center'
            }}
          >
            {this.getRightIcon()}
          </View>
        </View>
      </View>
    )
  }
}
