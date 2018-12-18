import { createAppContainer, createStackNavigator } from 'react-navigation'
import Main from './src/Main'

const stack = createStackNavigator(
  {
    SignedIn: Main
  },
  {
    initialRouteName: 'SignedIn',
    headerMode: 'none'
  }
)

export default createAppContainer(stack)
