import { createStackNavigator } from 'react-navigation'
import Home from './pages/Home'
import TootDetail from './pages/TootDetail'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import EditProfile from './pages/EditProfile'
import Search from './pages/Search'
import SendToot from './pages/SendToot'
import Test from './pages/Test'

export default createStackNavigator(
  {
    Home,
    TootDetail,
    Profile,
    Notifications,
    EditProfile,
    Search,
    SendToot,
    Test
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)
