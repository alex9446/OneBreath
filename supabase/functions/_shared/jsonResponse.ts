import { ResponseBody } from './mixed.types.ts'
import { corsHeaders } from './cors.ts'


export function jsonResponse<ExtraType>(body: ResponseBody<ExtraType>) {
  if (body.code !== 200) console.warn(body)

  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: body.code
  })
}

export function jsonResponseMessage<ExtraType>(message: string, code: number, extra?: ExtraType) {
  return jsonResponse<ExtraType>({ message, code, extra: extra ?? null })
}
