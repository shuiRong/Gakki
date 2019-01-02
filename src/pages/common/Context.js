import React, { Component } from 'react'
import { StyleSheet, FlatList, View } from 'react-native'
import globe from '../../utils/mobx'
import TootBox from './TootBox'
import Divider from './Divider'
import AnotherTootBox from './AnotherTootBox'

/**
 * 评论组件
 */
export default class data extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentWillMount() {
    this.setState({
      data: this.props.data
    })
  }

  componentWillReceiveProps({ data }) {
    this.setState({
      data: data
    })
  }

  /**
   * @description 回复某人
   * @param {id}: id
   * @param {username}: 用户名
   */
  replyTo = (id, username) => {
    globe.updateReply(id, username)
  }

  render() {
    const data = this.state.data
    if (!data.length) {
      return null
    }

    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={() => <Divider />}
          data={data}
          renderItem={({ item }) => {
            if (item.isMaster) {
              return (
                <AnotherTootBox
                  data={item}
                  navigation={this.props.navigation}
                  showTread={false}
                />
              )
            }
            return (
              <TootBox
                data={item}
                sensitive={item.sensitive}
                showTread={false}
              />
            )
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
