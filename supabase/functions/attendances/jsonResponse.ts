import { corsHeaders } from '../_shared/cors.ts'

type responseBody = {
  message: string
  code: number
  extra?: object | null
} | {
  catched_error: unknown
  code: number
}

export function jsonResponse(body: responseBody) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: body.code
  })
}

export function jsonResponseMessage(message: string, code: number,
                                    extra: object | null = null) {
  return jsonResponse({ message, code, extra })
}
