import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, Image } from 'react-native'
import { Button } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'
import ReplyInput from './common/ReplyInput'
import Header from './common/Header'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import { observer } from 'mobx-react'

let color = {}
const width = Dimensions.get('window').width
/**
 * Toot详情页面
 */
@observer
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
    color = themeData[mobx.theme]

    return (
      <View style={[styles.container, { backgroundColor: color.themeColor }]}>
        <Header
          left={
            <Button transparent>
              <Icon
                style={[styles.icon, { color: color.subColor }]}
                name={'arrow-left'}
                onPress={() => this.navigateToHome()}
              />
            </Button>
          }
          title={'发嘟'}
          right={
            <Image
              source={{ uri: mobx.account.avatar }}
              style={[styles.image, { overlayColor: color.themeColor }]}
            />
          }
        />
        <View
          style={[
            styles.inputBox,
            {
              backgroundColor: color.themeColor
            }
          ]}
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
  container: {
    flex: 1
  },
  inputBox: {
    width: width - 30,
    alignSelf: 'center',
    marginTop: 15,
    elevation: 5,
    borderRadius: 5
  },
  icon: {
    fontSize: 17
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 5
  }
})
