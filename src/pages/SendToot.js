import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
  Content,
  Card
} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'
import { getStatuses } from '../utils/api'
import ReplyInput from './common/ReplyInput'

/**
 * Toot详情页面
 */
export default class SendToot extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toot: {
        account: {}
      }
    }
  }

  componentDidMount() {
    getStatuses(this.props.navigation.getParam('id')).then(res => {
      this.setState({
        toot: res
      })
    })
  }

  // 发完toot，跳转回首页，并且将着返回的toot数据
  navigateToHome = data => {
    this.props.navigation.navigate('Home', {
      newToot: data
    })
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon
                style={[styles.icon, styles.navIcon]}
                name="arrow-left"
                onPress={() => this.navigateToHome()}
              />
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon style={[styles.icon, styles.navIcon]} name="ellipsis-h" />
            </Button>
          </Right>
        </Header>
        <Content padder>
          <Card style={{ borderRadius: 5 }}>
            <ReplyInput
              autoFocus={true}
              tootId={this.state.toot.id}
              sendMode={true}
              callback={this.navigateToHome}
            />
          </Card>
        </Content>
      </Container>
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
  body: {
    flexDirection: 'column'
  },
  time: {
    alignSelf: 'flex-start',
    color: 'grey',
    fontSize: 15,
    marginTop: 20
  },
  leftBody: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    fontSize: 17
  },
  navIcon: {
    fontSize: 20,
    color: '#fff'
  },
  bottomText: {
    marginLeft: 10
  }
})
