import { AsyncStorage } from 'react-native'

export const save = (key, value) => {
  return AsyncStorage.setItem(key, JSON.stringify(value))
}

export const fetch = (
  key,
  cb = err => {
    console.log(err)
  }
) => {
  return AsyncStorage.getItem(key, cb).then(res => JSON.parse(res))
}

export const multiMerge = (
  multi_set_pairs,
  cb = err => {
    console.log(err)
  }
) => {
  return AsyncStorage.multiMerge(multi_set_pairs, cb)
}

export const remove = (
  key,
  cb = err => {
    console.log(err)
  }
) => {
  return AsyncStorage.removeItem(key, cb)
}
