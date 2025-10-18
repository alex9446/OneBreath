// boilerplate code from here: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
export async function sha256(message: string) {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
}

export async function watchwordIsValid(word: string) {
  const validHash = 'f01ca46804dc6802b3e36ce83d69eee60bc8003ecb7c1adf9db9d182bbbd4e07'
  return validHash === await sha256(word)
}
