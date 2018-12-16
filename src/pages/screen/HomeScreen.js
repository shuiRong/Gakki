/**
 * 主页主体内容
 */

import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, YellowBox } from 'react-native'
import { List, ListItem, Left, Body, Thumbnail, Text } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { getHomeTimelines } from '../../utils/api'
import moment from 'moment'
import 'moment/locale/zh-cn'
import HTML from 'react-native-render-html'

YellowBox.ignoreWarnings(['Remote debugger'])

export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }
  componentDidMount() {
    getHomeTimelines().then(res => {
      console.log('res', res)
      this.setState({
        list: res
      })
    })
    console.log('123', this.props)
  }

  /**
   * 跳转入Toot详情页面
   */
  goTootDetail = id => {
    this.props.navigation.navigate('TootDetail', {
      id: id
    })
  }

  render() {
    return (
      <View style={styles.container} padder>
        <List>
          {this.state.list.map(item => {
            return (
              <ListItem
                avatar
                style={styles.list}
                key={item.id}
                button={true}
                onPress={() => this.goTootDetail(item.id)}
              >
                <Left>
                  <Thumbnail source={{ uri: item.account.avatar }} />
                </Left>
                <Body>
                  <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.titleWidth}>
                      {item.account.display_name || item.account.username}
                      <Text style={styles.smallGrey}>
                        @{item.account.username}
                      </Text>
                    </Text>
                    <Text>
                      {moment(item.created_at, 'YYYY-MM-DD')
                        .startOf('day')
                        .fromNow()}
                    </Text>
                  </View>
                  <View style={styles.htmlBox}>
                    <HTML
                      html={item.content}
                      tagsStyles={tagsStyles}
                      imagesMaxWidth={Dimensions.get('window').width}
                    />
                  </View>
                  <View style={styles.iconBox}>
                    <Icon style={styles.icon} name="reply" />
                    <Icon style={styles.icon} name="retweet" />
                    <Icon style={styles.icon} name="star" />
                    <Icon style={styles.icon} name="ellipsis-h" />
                  </View>
                </Body>
              </ListItem>
            )
          })}
        </List>
      </View>
    )
  }
}

const tagsStyles = {
  p: {
    color: '#2b2e3d',
    fontSize: 16,
    lineHeight: 20
  },
  a: {
    lineHeight: 20
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 20
  },
  list: {
    marginBottom: 10
  },
  right: {
    flexDirection: 'column',
    width: 260
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  smallGrey: {
    color: 'grey',
    fontSize: 15,
    fontWeight: 'normal'
  },
  titleWidth: {
    color: '#333',
    fontWeight: 'bold',
    width: 170,
    fontSize: 16
  },
  iconBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20
  },
  htmlBox: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10
  },
  icon: {
    fontSize: 15
  }
})
