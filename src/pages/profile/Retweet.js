import React, { Component } from 'react'
import Tab from './index'
import PropTypes from 'prop-types'

export default class Retweet extends Component {
  static propTypes = {
    params: PropTypes.object,
    navigation: PropTypes.object.isRequired,
    onScroll: PropTypes.func.isRequired,
    style: PropTypes.object
  }

  static defaultProps = {
    params: {},
    style: {}
  }

  render() {
    return (
      <Tab
        params={this.props.params}
        style={this.props.style}
        onScroll={this.props.onScroll}
        navigation={this.props.navigation}
      />
    )
  }
}
