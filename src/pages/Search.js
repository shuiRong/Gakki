/**
 * 搜索页面
 */

import React, { Component } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native'
import { Button } from 'native-base'
import { search } from '../utils/api'
import Icon from 'react-native-vector-icons/FontAwesome5'
import TootBox from './common/TootBox/Index'
import UserItem from './common/UserItem'
import Header from './common/Header'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import Divider from './common/Divider'
import { observer } from 'mobx-react'
import { CancelToken } from 'axios'

let color = {}
const deviceWidth = Dimensions.get('window').width
@observer
export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      loading: false,
      accounts: [],
      hashtags: [],
      statuses: []
    }

    this.cancel = null
  }

  componentDidMount() {
    this.search()
  }

  componentWillUnmount() {
    this.cancel && this.cancel()
  }

  refreshHandler = () => {
    this.setState({
      list: [],
      loading: false
    })
    this.search()
  }

  search = () => {
    search(mobx.domain, this.state.text, {
      cancelToken: new CancelToken(c => (this.cancel = c))
    })
      .then(res => {
        this.setState(res)
      })
      .catch(() => {
        this.setState({
          loading: false
        })
      })
  }

  render() {
    const state = this.state
    color = themeData[mobx.theme]

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: color.themeColor }]}
      >
        <Header
          left={
            <Button transparent>
              <Icon
                style={[styles.icon, { color: color.subColor }]}
                name={'arrow-left'}
                onPress={() => this.props.navigation.goBack()}
              />
            </Button>
          }
          title={
            <TextInput
              ref={ref => (this.ref = ref)}
              style={{
                width: deviceWidth * 0.7,
                height: 30,
                fontSize: 17,
                borderBottomColor: color.subColor,
                borderBottomWidth: 1,
                padding: 2,
                borderRadius: 3,
                color: color.contrastColor
              }}
              autoFocus={true}
              onChangeText={text =>
                this.setState({
                  text
                })
              }
              value={state.text}
              maxLength={20}
              onSubmitEditing={this.search}
            />
          }
          right={
            <Button
              transparent
              onPress={() => {
                this.ref.focus()
                this.setState({
                  text: ''
                })
              }}
            >
              <Icon
                style={[styles.icon, { color: color.subColor }]}
                name="times"
              />
            </Button>
          }
        />
        {state.accounts.length !== 0 ? (
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                paddingLeft: 15
              }}
            >
              <Icon
                style={{ color: color.subColor, fontSize: 20 }}
                name="users"
              />
              <Text
                style={{ fontSize: 20, marginLeft: 10, color: color.subColor }}
              >
                用户
              </Text>
            </View>
            <Divider />
            <FlatList
              ItemSeparatorComponent={() => <Divider />}
              showsVerticalScrollIndicator={false}
              data={state.accounts}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={state.loading}
                  onRefresh={this.refreshHandler}
                />
              }
              renderItem={({ item }) => (
                <UserItem account={item} navigation={this.props.navigation} />
              )}
            />
          </View>
        ) : (
          <View />
        )}
        {state.hashtags.length !== 0 ? (
          <View>
            <Divider />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                paddingLeft: 15
              }}
            >
              <Icon
                style={{ color: color.subColor, fontSize: 20 }}
                name="hashtag"
              />
              <Text
                style={{ fontSize: 20, marginLeft: 10, color: color.subColor }}
              >
                标签
              </Text>
            </View>
            <Divider />
            <FlatList
              ItemSeparatorComponent={() => <Divider />}
              showsVerticalScrollIndicator={false}
              data={state.hashtags}
              keyExtractor={item => item.name}
              refreshControl={
                <RefreshControl
                  refreshing={state.loading}
                  onRefresh={this.refreshHandler}
                />
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ padding: 10, paddingLeft: 15, paddingRight: 15 }}
                  onPress={() =>
                    this.props.navigation.navigate('Tag', {
                      id: item.name
                    })
                  }
                >
                  <Text style={{ color: color.contrastColor }}>
                    #{item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          <View />
        )}
        {state.statuses.length !== 0 ? (
          <View>
            <Divider />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                paddingLeft: 15
              }}
            >
              <Icon
                style={{ color: color.subColor, fontSize: 20 }}
                name="quote-right"
              />
              <Text
                style={{ fontSize: 20, marginLeft: 10, color: color.subColor }}
              >
                嘟文
              </Text>
            </View>
            <Divider />
            <FlatList
              ItemSeparatorComponent={() => <Divider />}
              showsVerticalScrollIndicator={false}
              data={state.statuses}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={state.loading}
                  onRefresh={this.refreshHandler}
                />
              }
              renderItem={({ item }) => (
                <TootBox
                  data={item}
                  navigation={this.props.navigation}
                  deleteToot={this.deleteToot}
                  muteAccount={this.muteAccount}
                  blockAccount={this.blockAccount}
                />
              )}
            />
          </View>
        ) : (
          <View />
        )}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0
  },
  icon: {
    fontSize: 17
  }
})
