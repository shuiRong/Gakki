import React, { PureComponent } from 'react'
import { StyleSheet, FlatList, View } from 'react-native'
import PropTypes from 'prop-types'
import TootBox from './TootBox'
import Divider from './Divider'

/**
 * 评论组件
 */
export default class Context extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this.setState({
      data: this.props.data
    })
  }

  componentWillReceiveProps({ data }) {
    this.setState({
      data: data
    })
  }

  render() {
    const data = this.state.data
    if (!data.length) {
      return null
    }

    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={() => <Divider />}
          data={data}
          renderItem={({ item }) => {
            if (item.isMaster) {
              return (
                <TootBox
                  isMaster={true}
                  data={item}
                  navigation={this.props.navigation}
                  sensitive={item.sensitive}
                  showTread={false}
                />
              )
            }
            return (
              <TootBox
                data={item}
                navigation={this.props.navigation}
                sensitive={item.sensitive}
                showTread={false}
              />
            )
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
