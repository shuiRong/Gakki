// /**
//  * 存储全局状态
//  */

import { observable, autorun } from 'mobx'

class Globe {
  constructor() {}

  @observable screen = 0

  updateScreen(screen) {
    this.screen = screen
  }
}

const globe = new Globe()

// autorun(() => {
//   alert(globe.screen)
//   console.log('screen is: %d', globe.screen)
//   console.log('count is: %d', globe.count)
// })

// setInterval(() => {
//   globe.updateScreen(globe.screen + 1)
// }, 2000)

export default globe
