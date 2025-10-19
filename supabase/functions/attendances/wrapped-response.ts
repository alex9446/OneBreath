import { corsHeaders } from '../_shared/cors.ts'

export function jsonResponse(json: object, status: number) {
  return new Response(JSON.stringify({...json, code: status}), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: status
  })
}

export function jsonResponseMessage(message: string, status: number,
                                    extra: object | null = null) {
  return jsonResponse({ message, extra }, status)
}
