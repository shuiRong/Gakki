import AsyncStorage from '@react-native-community/async-storage'

export const save = (key, value) => {
  return AsyncStorage.setItem(key, JSON.stringify(value))
}

export const fetch = (key, cb = () => {}) => {
  return AsyncStorage.getItem(key, cb).then(res => JSON.parse(res))
}

export const multiMerge = (multi_set_pairs, cb = () => {}) => {
  return AsyncStorage.multiMerge(multi_set_pairs, cb)
}

export const remove = (key, cb = () => {}) => {
  return AsyncStorage.removeItem(key, cb)
}
