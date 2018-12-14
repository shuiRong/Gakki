import React, { Component } from 'react'
import { Text, StyleSheet, View, Button } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation';
export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'HomeScreen'
  }
  render() {
    return (
      <View>
        <Text> one </Text>
        <Button title="go to two" onPress={() => this.props.navigation.navigate('Profile')} />
      </View>
    )
  }
}

const styles = StyleSheet.create({})