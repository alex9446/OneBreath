const manageRawError = (rawError: unknown) => {
  if (!rawError) return ''
  if (typeof rawError === 'string') return rawError
  if (rawError instanceof Object && 'message' in rawError && typeof rawError.message === 'string') {
    return rawError.message
  }
  console.error(rawError)
  return 'Errore non testuale, maggiori dettagli in console log'
}

export default manageRawError
