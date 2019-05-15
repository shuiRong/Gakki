/**
 * 私信页面
 */

import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { Button } from 'native-base'
import { getBlocks, getRelationship } from '../utils/api'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Header from './common/Header'
import { themeData } from '../utils/color'
import mobx from '../utils/mobx'
import Divider from './common/Divider'
import Empty from './common/Empty'
import UserItem from './common/UserItem'
import { UserSpruce } from './common/Spruce'
import { CancelToken } from 'axios'

export default ({ navigation }) => {
  let cancel = []
  const color = themeData[mobx.theme]
  const [list, setList] = useState([])
  const [relationships, setRelationships] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlocksFunc()
    return () => {
      cancel.forEach(item => item && item())
    }
  }, [loading])

  /**
   * @description 获取时间线数据
   * @param {params}: 分页参数
   */
  const getBlocksFunc = (params = { limit: 100 }) => {
    getBlocks(mobx.domain, params, {
      cancelToken: new CancelToken(c => cancel.push(c))
    })
      .then(res => {
        // 同时将数据更新到state数据中，刷新视图
        setList(res)
        setLoading(false)
        getRelationshipFunc(list.map(item => item.id))
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const getRelationshipFunc = ids => {
    getRelationship(mobx.domain, ids, {
      cancelToken: new CancelToken(c => cancel.push(c))
    }).then(res => {
      setRelationships(res)
    })
  }

  const refreshHandler = () => {
    setLoading(true)
    setList([])
  }

  const deleteUser = id => {
    setList(list.filter(item => item.id !== id))
  }

  /**
   * @description 从关系数组中找到特定用户的数据
   * @param {id}: account.id
   */
  const findOne = id => {
    const result = relationships.filter(item => item.id === id)[0]
    return result || {}
  }


  return (
    <View style={[styles.container, { backgroundColor: color.themeColor }]}>
      <Header
        left={
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon
              style={[styles.icon, { color: color.subColor }]}
              name={'arrow-left'}
            />
          </Button>
        }
        title={'已屏蔽用户'}
        right={'none'}
      />
      {loading ? (
        <UserSpruce />
      ) : (
        <FlatList
          ItemSeparatorComponent={() => <Divider />}
          ListFooterComponent={list.length ? <Divider /> : <View />}
          ListEmptyComponent={<Empty />}
          showsVerticalScrollIndicator={false}
          data={list}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshHandler} />
          }
          renderItem={({ item }) => (
            <UserItem
              account={item}
              model={'block'}
              relationshipData={findOne(item.id)}
              navigation={navigation}
              deleteUser={deleteUser}
            />
          )}
        />
      )}
    </View>
  )
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
