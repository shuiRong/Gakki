import React, { Component } from 'react'
import { StyleSheet, Text, View, Animated, FlatList } from 'react-native'

class List extends Component {
  render() {
    // 模拟列表数据
    const mockData = [
      '富强',
      '民主',
      '文明',
      '和谐',
      '自由',
      '平等',
      '公正',
      '法治',
      '爱国',
      '敬业',
      '诚信',
      '友善'
    ]

    return (
      <FlatList
        onScroll={this.props.onScroll}
        data={mockData}
        renderItem={({ item }) => (
          <View style={styles.list}>
            <Text>{item}</Text>
          </View>
        )}
      />
    )
  }
}

export default class AnimatedScrollDemo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      headerTop: new Animated.Value(0)
    }
  }

  componentWillMount() {
    // P.S. 270,217,280区间的映射是告诉interpolate，所有大于270的值都映射成-50
    // 这样就不会导致Header在上滑的过程中一直向上滑动了
    this.top = this.state.headerTop.interpolate({
      inputRange: [0, 270, 271, 280],
      outputRange: [0, -50, -50, -50]
    })

    this.animatedEvent = Animated.event([
      {
        nativeEvent: {
          contentOffset: { y: this.state.headerTop }
        }
      }
    ])
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={{ top: this.top }}>
          <View style={styles.header}>
            <Text style={styles.text}>linshuirong.cn</Text>
          </View>
        </Animated.View>
        {/* 在oHeader组件上移的同时，列表容器也需要同时向上移动，需要注意。 */}
        <Animated.View style={{ top: this.top }}>
          <List onScroll={this.animatedEvent} />
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    height: 80,
    backgroundColor: 'pink',
    marginBottom: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff'
  },
  header: {
    height: 50,
    backgroundColor: '#3F51B5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: '#ffffff'
  }
})
