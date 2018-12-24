import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
  Animated,
  Easing,
  ScrollView
} from 'react-native'

let deviceHeight = require('Dimensions').get('window').height
let deviceWidth = require('Dimensions').get('window').width
export default class AnimatedScrollDemo extends React.Component {
  state: {
    xOffset: Animated
  }
  constructor(props) {
    super(props)
    this.state = {
      xOffset: new Animated.Value(1.0)
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          horizontal={true} //水平滑动
          showsHorizontalScrollIndicator={false}
          style={{ width: deviceWidth, height: deviceHeight }} //设置大小
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: this.state.xOffset } } }] //把contentOffset.x绑定给this.state.xOffset
          )}
          scrollEventThrottle={100} //onScroll回调间隔
        >
          <Animated.Image
            source={{
              uri:
                'https://img.moegirl.org/common/thumb/1/11/Winner-elimination-2015.jpg/250px-Winner-elimination-2015.jpg'
            }}
            style={{
              height: deviceHeight,
              width: deviceWidth,
              opacity: this.state.xOffset.interpolate({
                //映射到0.0,1.0之间
                inputRange: [0, 375],
                outputRange: [1.0, 0.0]
              })
            }}
            resizeMode="cover"
          />
          <Image
            source={{
              uri:
                'https://img.moegirl.org/common/thumb/6/68/Chitanda.Eru.full.1053233.jpg/250px-Chitanda.Eru.full.1053233.jpg'
            }}
            style={{ height: deviceHeight, width: deviceWidth }}
            resizeMode="cover"
          />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flex: 1
  }
})
