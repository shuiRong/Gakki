import React, { Component } from 'react'
import { View, Text } from 'react-native'

export default class ListFooterComponent extends Component {
  render() {
    return (
      <View
        style={{
          height: 300,
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Text style={{ marginTop: 50 }}>
          {this.props.info || '没有更多了...'}
        </Text>
      </View>
    )
  }
}
