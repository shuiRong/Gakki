import { createStackNavigator } from 'react-navigation'
import Main from './src/Main'
import SignedOut from './src/SignedOutNavigator'
// 禁用所有黄色警告
console.disableYellowBox = true
// 将报错（会在屏幕上弹出，影响操作）转换为异常（只会在控制台报错，不影响操作）
console.reportErrorsAsExceptions = false

export default createStackNavigator(
  {
    SignedIn: Main,
    SignedOut
  },
  {
    initialRouteName: 'SignedOut',
    headerMode: 'none'
  }
)
