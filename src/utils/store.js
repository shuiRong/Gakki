import { AsyncStorage } from 'react-native'

export const save = (key, value) => {
  return AsyncStorage.setItem(key, JSON.stringify(value))
}

export const fetch = key => {
  return AsyncStorage.getItem(key)
}

export const merge = (key, value, cb) => {
  return AsyncStorage.mergeItem(key, value, cb)
}
