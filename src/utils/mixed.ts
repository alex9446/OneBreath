// boilerplate code from here: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
export const sha256 = async (message: string) => {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
}

export const watchwordIsValid = async (word: string) => {
  const validHash = 'f01ca46804dc6802b3e36ce83d69eee60bc8003ecb7c1adf9db9d182bbbd4e07'
  return validHash === await sha256(word)
}

const setKeyNumInLS = (keyName: string, numValue: string | number) => {
  localStorage.setItem(keyName, numValue.toString())
}

const getKeyNumInLS = (keyName: string, defaultNaN: number) => {
  const keyValue = parseInt(localStorage.getItem(keyName) ?? '')
  if (isNaN(keyValue)) return defaultNaN
  return keyValue
}

export const setGroupInLS = (groupId: string | number) => setKeyNumInLS('group_id', groupId)
export const getGroupFromLS = () => getKeyNumInLS('group_id', 1)

export const setAdminInLS = (adminLevel: number) => setKeyNumInLS('admin_level', adminLevel)
export const getAdminInLS = () => getKeyNumInLS('admin_level', 0)

export const base64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const getFirstChars = (sentence: string | null) => {
  if (!sentence) return ''
  return sentence.trim().split(/\s+/).map((word) => word[0]).join('')
}
