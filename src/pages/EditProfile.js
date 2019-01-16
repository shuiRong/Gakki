/**
 * 个人资料编辑页面
 */

import React, { Component } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TextInput,
  Text
} from 'react-native'
import {
  Spinner,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
  CheckBox
} from 'native-base'
import { getNotifications } from '../utils/api'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { color } from '../utils/color'

export default class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      description: '',
      displayName: '',
      lockAccount: true
    }
  }
  componentDidMount() {}

  render() {
    const state = this.state
    if (state.loading) {
      return <Spinner style={{ marginTop: 250 }} color={color.headerBg} />
    }
    return (
      <ScrollView style={styles.container}>
        <Header>
          <Left>
            <Button transparent>
              <Icon
                style={styles.navIcon}
                name="arrow-left"
                onPress={() => this.props.navigation.goBack()}
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
        <View contentContainerStyle={styles.body}>
          <ImageBackground
            source={{
              uri:
                'https://cmx.im/system/accounts/headers/000/081/232/original/f6d371ea63e221e1.jpeg?1544620479'
            }}
            style={styles.bg}
          >
            <View
              style={{
                width: '100%',

                backgroundColor: color.moreBlack,
                opacity: 0.5,
                position: 'absolute'
              }}
            />
            <Icon name="cloud-upload-alt" style={styles.upload} />
            <ImageBackground
              source={{
                uri:
                  'https://cmx.im/system/accounts/avatars/000/081/232/original/6fde03bb798bd111.jpg?1544620479'
              }}
              style={styles.avatarBg}
              imageStyle={{
                borderRadius: 8
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: color.moreBlack,
                  opacity: 0.5,
                  position: 'absolute'
                }}
              />
              <Icon
                name="cloud-upload-alt"
                style={{ ...styles.upload, fontSize: 24 }}
              />
            </ImageBackground>
          </ImageBackground>
          <View style={{ padding: 20, marginTop: 50 }}>
            <View>
              <Text style={{ fontSize: 17, color: color.grey }}>昵称</Text>
              <TextInput
                style={styles.baseInput}
                onChangeText={text =>
                  this.setState({
                    displayName: text
                  })
                }
                value={state.displayName}
                maxLength={10}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 17, color: color.grey }}>简介</Text>
              <TextInput
                style={[styles.baseInput, styles.multilineInput]}
                onChangeText={text =>
                  this.setState({
                    description: text
                  })
                }
                value={state.description}
                multiline={true}
                textAlignVertical={'top'}
                placeholder={'...'}
                maxLength={400}
                numberOfLines={4}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 40,
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <CheckBox
                checked={state.lockAccount}
                color={color.headerBg}
                onPress={() =>
                  this.setState({
                    lockAccount: !state.lockAccount
                  })
                }
              />
              <View style={{ marginLeft: 20 }}>
                <Text style={{ fontSize: 18, color: color.moreBlack }}>
                  保护你的账户（锁嘟）
                </Text>
                <Text style={{ color: color.grey }}>
                  你需要手动审核所有关注请求
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 17, color: color.grey }}>
                个人资料附加信息
              </Text>
              <View
                style={{
                  marginTop: 20,
                  borderColor: color.lightGrey,
                  borderWidth: 0.5,
                  padding: 20
                }}
              >
                <TextInput
                  style={[styles.baseInput, { borderColor: color.moreBlack }]}
                  onChangeText={text =>
                    this.setState({
                      displayName: text
                    })
                  }
                  value={state.displayName}
                  maxLength={10}
                />
                <TextInput
                  style={[styles.baseInput, { borderColor: color.moreBlack }]}
                  onChangeText={text =>
                    this.setState({
                      displayName: text
                    })
                  }
                  value={state.displayName}
                  maxLength={10}
                />
              </View>
              <View
                style={{
                  marginTop: 20,
                  borderColor: color.lightGrey,
                  borderWidth: 0.5,
                  padding: 20
                }}
              >
                <TextInput
                  style={[styles.baseInput, { borderColor: color.moreBlack }]}
                  onChangeText={text =>
                    this.setState({
                      displayName: text
                    })
                  }
                  value={state.displayName}
                  maxLength={10}
                />
                <TextInput
                  style={[styles.baseInput, { borderColor: color.moreBlack }]}
                  onChangeText={text =>
                    this.setState({
                      displayName: text
                    })
                  }
                  value={state.displayName}
                  maxLength={10}
                />
              </View>
              <View
                style={{
                  marginTop: 20,
                  borderColor: color.lightGrey,
                  borderWidth: 0.5,
                  padding: 20
                }}
              >
                <TextInput
                  style={[styles.baseInput, { borderColor: color.moreBlack }]}
                  onChangeText={text =>
                    this.setState({
                      displayName: text
                    })
                  }
                  value={state.displayName}
                  maxLength={10}
                />
                <TextInput
                  style={[styles.baseInput, { borderColor: color.moreBlack }]}
                  onChangeText={text =>
                    this.setState({
                      displayName: text
                    })
                  }
                  value={state.displayName}
                  maxLength={10}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: color.white
  },
  body: {
    flex: 1
  },
  navIcon: {
    fontSize: 20,
    color: color.lightGrey
  },
  bg: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarBg: {
    width: 80,
    height: 80,
    position: 'absolute',
    bottom: -40,
    left: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  upload: {
    color: color.white,
    fontSize: 30
  },
  baseInput: {
    borderWidth: 0,
    borderColor: color.moreBlack,
    borderBottomWidth: 2,
    paddingBottom: 5,
    fontSize: 20,
    color: color.moreBlack,
    height: 50
  },
  multilineInput: {
    height: 120
  }
})
