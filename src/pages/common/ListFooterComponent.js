import React, { Component } from 'react'
import { View, Text } from 'react-native'

export default class ListFooterComponent extends Component {
  render() {
    return (
      <View
        style={{
          height: 100,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text>{this.props.info || '正在加载...'}</Text>
      </View>
    )
  }
}
