import { Extra, ResponseBody } from './mixed.types.ts'
import { corsHeaders } from './cors.ts'


export function jsonResponse(body: ResponseBody) {
  if (body.code !== 200) console.warn(body)

  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: body.code
  })
}

export function jsonResponseMessage(message: string, code: number, extra?: Extra) {
  return jsonResponse({ message, code, extra: extra ?? null })
}
