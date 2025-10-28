import { jsonResponse, jsonResponseMessage } from '../_shared/jsonResponse.ts'

export function manageRawError(rawError: unknown) {
  if (rawError instanceof Object) {
    if ('message' in rawError && typeof rawError.message === 'string') {
      return jsonResponseMessage(rawError.message, 500)
    }
    const message = 'error not displayable on screen, it\'s an Object!'
    return jsonResponse({ message, catched_error: rawError, code: 500, extra: null })
  }
  return jsonResponseMessage('error not displayable on screen, not an Object!', 500)
}
