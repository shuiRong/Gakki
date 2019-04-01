import { createStackNavigator, createDrawerNavigator } from 'react-navigation'
import { Dimensions } from 'react-native'
import Home from './pages/Home'
import TootDetail from './pages/TootDetail'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Envelope from './pages/Envelope'
import BlockedUsers from './pages/BlockedUsers'
import MutedUsers from './pages/MutedUsers'
import Followers from './pages/Followers'
import FollowRequestList from './pages/FollowRequestList'
import Tag from './pages/Tag'
import Auth from './pages/Auth'
import Following from './pages/Following'
import About from './pages/About'
import Setting from './pages/Setting'
import OpenSource from './pages/OpenSource'
import Search from './pages/Search'
import SendToot from './pages/SendToot'
import Test from './pages/Test'
import SideBar from './pages/SideBar'

const deviceWidth = Dimensions.get('window').width

const Drawer = createDrawerNavigator(
  { Home },
  {
    initialRouteName: 'Home',
    drawerWidth: deviceWidth * 0.78,
    contentOptions: {
      activeTintColor: '#e91e63'
    },
    contentComponent: SideBar
  }
)

export default createStackNavigator(
  {
    Drawer,
    TootDetail,
    Notifications,
    Profile,
    Envelope,
    BlockedUsers,
    MutedUsers,
    Followers,
    Following,
    FollowRequestList,
    About,
    Setting,
    Tag,
    Auth,
    OpenSource,
    Search,
    SendToot,
    Test
  },
  {
    initialRouteName: 'Drawer',
    headerMode: 'none'
  }
)
