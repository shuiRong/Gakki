import { createAppContainer, createStackNavigator } from 'react-navigation'
import Home from './pages/Home'
import TootDetail from './pages/TootDetail'
import Notifications from './pages/Notifications'
import Search from './pages/Search'
import SendToot from './pages/SendToot'

const stack = createStackNavigator(
  {
    Home: Home,
    TootDetail: TootDetail,
    Notifications: Notifications,
    Search: Search,
    SendToot: SendToot
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)

export default createAppContainer(stack)
