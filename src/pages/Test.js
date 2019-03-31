import { Component, default as React } from 'react'
import { View, FlatList, ScrollView, Text } from 'react-native'

export default class LabScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { enableScrollViewScroll: true }
  }

  render() {
    return (
      <View
        onStartShouldSetResponderCapture={() => {
          this.setState({ enableScrollViewScroll: true })
        }}
      >
        <ScrollView
          scrollEnabled={this.state.enableScrollViewScroll}
          ref={myScroll => (this._myScroll = myScroll)}
        >
          {this.renderFlatList('red')}
          {this.renderFlatList('green')}
          {this.renderFlatList('purple')}
          {this.renderFlatList('pink')}
        </ScrollView>
      </View>
    )
  }

  getRandomData = () => {
    return new Array(100).fill('').map((item, index) => {
      return { title: 'Title ' + (index + 1) }
    })
  }

  renderFlatList(color) {
    return (
      <View
        onStartShouldSetResponderCapture={() => {
          this.setState({ enableScrollViewScroll: false })
          if (
            this._myScroll.contentOffset === 0 &&
            this.state.enableScrollViewScroll === false
          ) {
            this.setState({ enableScrollViewScroll: true })
          }
        }}
      >
        <FlatList
          data={this.getRandomData()}
          backgroundColor={color}
          maxHeight={200}
          marginBottom={50}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text>{item.title}</Text>}
        />
      </View>
    )
  }
}
