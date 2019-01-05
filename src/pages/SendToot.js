import React, { Component } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { Header, Left, Body, Right, Button, Title } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'
import ReplyInput from './common/ReplyInput'
import { color } from '../utils/color'

const width = Dimensions.get('window').width
/**
 * Toot详情页面
 */
export default class SendToot extends Component {
  constructor(props) {
    super(props)
  }

  // 发完toot，跳转回首页，并且将着返回的toot数据
  navigateToHome = data => {
    this.props.navigation.navigate('Home', {
      newToot: data
    })
  }

  render() {
    return (
      <View>
        <Header>
          <Left>
            <Button transparent>
              <Icon
                style={styles.navIcon}
                name="arrow-left"
                onPress={() => this.navigateToHome()}
              />
            </Button>
          </Left>
          <Body>
            <Title>发嘟</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon style={styles.navIcon} name="ellipsis-h" />
            </Button>
          </Right>
        </Header>
        <View
          style={{
            width: width - 30,
            alignSelf: 'center',
            marginTop: 15,
            backgroundColor: color.white,
            elevation: 5,
            borderRadius: 5
          }}
        >
          <ReplyInput
            autoFocus={true}
            tootId={this.props.navigation.getParam('id')}
            sendMode={true}
            callback={this.navigateToHome}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navIcon: {
    fontSize: 20,
    color: color.lightGrey
  }
})
