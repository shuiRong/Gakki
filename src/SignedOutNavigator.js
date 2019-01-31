import { createStackNavigator } from 'react-navigation'
import Auth from './pages/Auth'
import Login from './pages/Login'

export default createStackNavigator(
  {
    Auth,
    Login
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none'
  }
)
