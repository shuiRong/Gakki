import { createStackNavigator } from 'react-navigation'
import Auth from './pages/Auth'
import Login from './pages/Login'
import Launcher from './pages/Launcher'

export default createStackNavigator(
  {
    Auth,
    Login,
    Launcher
  },
  {
    initialRouteName: 'Launcher',
    headerMode: 'none'
  }
)
