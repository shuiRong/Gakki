import { AsyncStorage } from 'react-native'

export const save = (key, value) => {
  return AsyncStorage.setItem(key, JSON.stringify(value))
}

export const fetch = key => {
  return AsyncStorage.getItem(key).then(res => JSON.parse(res))
}

export const merge = (key, value, cb) => {
  return AsyncStorage.mergeItem(key, value, cb)
}

export const remove = (key, cb) => {
  return AsyncStorage.removeItem(key, cb)
}
