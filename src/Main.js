import { createAppContainer, createStackNavigator } from 'react-navigation'
import Home from './pages/Home'
import TootDetail from './pages/TootDetail'

const stack = createStackNavigator(
  {
    Home: Home,
    TootDetail: TootDetail
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)

export default createAppContainer(stack)
