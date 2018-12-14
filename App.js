import { createAppContainer, createStackNavigator } from 'react-navigation'
import Main from './src/Main'
import SignedOutNavigator from './src/SignedOutNavigator'

const stack = createStackNavigator(
  {
    SignedIn: Main,
    SignedOut: SignedOutNavigator
  },
  {
    initialRouteName: 'SignedIn',
    headerMode: 'none'
  }
)

export default createAppContainer(stack)
