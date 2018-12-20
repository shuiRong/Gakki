import { createAppContainer, createStackNavigator } from 'react-navigation'
import Home from './pages/Home'
import TootDetail from './pages/TootDetail'
import Reply from './pages/Reply'
import Notifications from './pages/Notifications'
import Search from './pages/Search'
import SendToot from './pages/SendToot'

const stack = createStackNavigator(
  {
    Home: Home,
    TootDetail: TootDetail,
    Reply: Reply,
    Notifications: Notifications,
    Search: Search,
    SendToot: SendToot
  },
  {
    initialRouteName: 'TootDetail',
    headerMode: 'none'
  }
)

export default createAppContainer(stack)
