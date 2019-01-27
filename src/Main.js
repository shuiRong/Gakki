import { createStackNavigator } from 'react-navigation'
import Home from './pages/Home'
import TootDetail from './pages/TootDetail'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Envelope from './pages/Envelope'
import BlockedUsers from './pages/BlockedUsers'
import MutedUsers from './pages/MutedUsers'
import Followers from './pages/Followers'
import Following from './pages/Following'
import About from './pages/About'
import OpenSource from './pages/OpenSource'
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
    Envelope,
    BlockedUsers,
    MutedUsers,
    Followers,
    Following,
    About,
    OpenSource,
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
