import { createStackNavigator } from 'react-navigation'
import Main from './src/Main'
// // 禁用所有黄色警告
console.disableYellowBox = true

export default createStackNavigator(
  {
    SignedIn: Main
  },
  {
    initialRouteName: 'SignedIn',
    headerMode: 'none'
  }
)
