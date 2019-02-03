import React, { Component } from 'react'
import { StyleSheet, Image, View, Animated, FlatList } from 'react-native'

export default class Test extends Component {
  render() {
    return (
      <View style={{ width: 200, height: 300, backgroundColor: 'pink' }}>
        <Image
          style={{ backgroundColor: 'blue', width: 100, height: '100%' }}
        />
      </View>
    )
  }
}
