import { createAppContainer, createStackNavigator } from 'react-navigation'
import Home from './pages/Home'

const stack = createStackNavigator(
  {
    Home: Home
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)

export default createAppContainer(stack)
