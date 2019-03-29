import React, { Component } from 'react'
import { StyleSheet, View, StatusBar } from 'react-native'
import PropTypes from 'prop-types'
import { Header, Left, Body, Right, Button, Title } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { themeData } from '../../utils/color'
import mobx from '../../utils/mobx'
import { observer } from 'mobx-react'

/**
 * @description 公用Header，默认是首页Header，其他页面使用时可自行传入组件
 */
let color = {}
@observer
export default class HeaderItem extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    style: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    left: PropTypes.element,
    right: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  }

  static defaultProps = {
    style: {}
  }

  /**
   * @description 右侧三种可能的情况：
   * 1. 空白 2. 展示传入组件 3. 展示默认组件
   */
  getRight = props => {
    if (props.right === 'none') {
      return (
        <Right>
          <View />
        </Right>
      )
    }
    return props.right ? (
      <Right>{props.right}</Right>
    ) : (
      <Right>
        <Button
          transparent
          onPress={() => props.navigation.navigate('Notifications')}
        >
          <Icon style={[styles.icon, { color: color.subColor }]} name="bell" />
        </Button>
        <Button transparent onPress={() => props.navigation.navigate('Search')}>
          <Icon
            style={[styles.icon, { color: color.subColor }]}
            name="search"
          />
        </Button>
      </Right>
    )
  }

  render() {
    const props = this.props
    color = themeData[mobx.theme]
    const barStyle = mobx.theme === 'black' ? 'light-content' : 'dark-content'

    return (
      <Header
        noShadow={true}
        style={[
          props.style,
          {
            backgroundColor: color.themeColor
          }
        ]}
      >
        <StatusBar backgroundColor={color.themeColor} barStyle={barStyle} />
        <Left>
          {props.left || (
            <Button
              transparent
              onPress={() => {
                props.navigation.toggleDrawer()
              }}
            >
              <Icon
                style={[styles.icon, { color: color.subColor }]}
                name="bars"
              />
            </Button>
          )}
        </Left>
        <Body>
          {typeof props.title === 'string' ? (
            <Title style={{ color: color.contrastColor }}>{props.title}</Title>
          ) : (
            props.title
          )}
        </Body>
        {this.getRight(props)}
      </Header>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 17
  }
})
