import React from 'react'
import { FlatList, View } from 'react-native'
import TootBox from './TootBox/Index'
import Divider from './Divider'
import Empty from './Empty'

/**
 * 评论组件
 */

// 如果不需要更新组件，则返回true
const areEqual = (prevProps, nextProps) => {
  return prevProps.data.length === nextProps.data.length
}

const Context = ({ data = [], navigation = () => {} }) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={<Empty />}
        data={data}
        renderItem={({ item }) => {
          if (item.isMaster) {
            return (
              <TootBox
                isMaster={true}
                data={item}
                navigation={navigation}
                sensitive={item.sensitive}
                showTread={false}
              />
            )
          }
          return (
            <TootBox
              data={item}
              navigation={navigation}
              sensitive={item.sensitive}
              showTread={false}
            />
          )
        }}
      />
    </View>
  )
}

export default React.memo(Context, areEqual)
