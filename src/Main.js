import { createStackNavigator } from 'react-navigation'
import Home from './pages/Home'
import TootDetail from './pages/TootDetail'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Search from './pages/Search'
import SendToot from './pages/SendToot'
import Test from './pages/Test'

export default createStackNavigator(
  {
    Home: Home,
    TootDetail: TootDetail,
    Profile: Profile,
    Notifications: Notifications,
    Search: Search,
    SendToot: SendToot,
    Test: Test
  },
  {
    initialRouteName: 'SendToot',
    headerMode: 'none'
  }
)
