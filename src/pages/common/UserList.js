import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Clipboard
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { blockAccount } from '../../utils/api'
import { themeData } from '../../utils/color'
import mobx from '../../utils/mobx'
import HTMLView from './HTMLView'
import { observer } from 'mobx-react'

export default class UserList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: {}
    }
  }

  componentDidMount() {
    this.setState({
      account: this.props.data
    })
  }

  componentWillReceiveProps({ data }) {
    this.setState({
      account: data
    })
  }

  render() {
    const account = this.state.account

    return (
      <View>
        <Image
          source={{ uri: account.avatar }}
          style={{ width: 40, height: 40, borderRadius: 5 }}
        />
        <View>
          <HTMLView
            data={account.display_name || account.username}
            emojiObj={state.emojiObj}
          />
          <Text>{account.username}</Text>
        </View>
        <View>
          <Icon name={'bell'} />
          <Icon name={'bell'} />
        </View>
      </View>
    )
  }
}
