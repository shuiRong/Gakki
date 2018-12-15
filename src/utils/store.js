/**
 * 存储全局状态
 */

import { observable, autorun } from 'mobx'

const globe = observable({
  screen: 0, // 首页...
  count: 0
})

autorun(function() {
  console.log('screen is: %d', globe.screen)
  console.log('count is: %d', globe.count)
})

setInterval(() => {
  globe.count++
}, 2000)

export default globe
