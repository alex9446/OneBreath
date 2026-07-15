import { getDenoEnv } from '@shared/mixed.deno.ts'
import { createJsonResponseMessage } from '../_shared/jsonResponse.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { startJob } from './startJob.ts'
import { manageRawError } from '../_shared/manageRawError.ts'

const jsonResponseMessage = createJsonResponseMessage<null>()

console.info(`Edge function "restart-job" up and running!`)


Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const auth = req.headers.get('X-Auth-Token')
    if (!auth) return jsonResponseMessage('missing X-Auth-Token header!', 401)
    if (auth !== getDenoEnv('RESTART_SECRET_KEY')) {
      return jsonResponseMessage('token not valid!', 401)
    }

    const { slug, started } = await req.json()
    if (typeof slug !== 'string') return jsonResponseMessage('slug is not a string!', 400)
    if (typeof started !== 'boolean') return jsonResponseMessage('started is not a boolean!', 400)
    if (started) return jsonResponseMessage('started is not false, see job logs', 200)

    const start = await startJob(slug, getDenoEnv('SCW_REGION'), getDenoEnv('SCW_SECRET_KEY'))
    if (start.error) return jsonResponseMessage(start.error.message, start.error.code)

    return jsonResponseMessage(`start request sended -> ${start.data.statusCode}`, 200)
  } catch (rawError) {
    return manageRawError(rawError)
  }
})
