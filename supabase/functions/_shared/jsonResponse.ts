import { ResponseBody } from '@shared/functions.types.ts'
import { corsHeaders } from './cors.ts'


const jsonResponse = <T>(body: ResponseBody<T>) => {
  if (body.code !== 200) console.warn(body)

  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: body.code
  })
}

const createJsonResponseMessage = <T>() => (
  (message: string, code: number, extra: T | null = null) => (
    jsonResponse({ message, code, extra })
  )
)

export { jsonResponse, createJsonResponseMessage }
