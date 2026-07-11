import { validate as validateUUID } from 'uuid'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@shared/database.types.ts'
import { getDenoEnv } from '@shared/mixed.ts'
import sendNotifications from '@shared/sendNotifications.ts'
import { createJsonResponseMessage } from '../_shared/jsonResponse.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { userIsAdmin, validateUser } from '../_shared/validateUser.ts'
import { manageRawError } from '../_shared/manageRawError.ts'

const isValidUUIDList = (list: unknown): list is string[] => (
  Array.isArray(list) && list.every(validateUUID)
)
const jsonResponseMessage = createJsonResponseMessage<null>()

console.info(`Edge function "broadcast" up and running!`)


Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { user_ids, message } = await req.json()
    if (!isValidUUIDList(user_ids)) return jsonResponseMessage('user_ids is not a valid list of UUID!', 400)
    if (typeof message !== 'string') return jsonResponseMessage('message is not a string!', 400)

    const supabaseAdmin = createClient<Database>(
      getDenoEnv('SUPABASE_URL'),
      getDenoEnv('SECRET_FUNCTIONS_KEY')
    )

    const validate = await validateUser(req.headers.get('Authorization'), supabaseAdmin)
    if (validate.error) return jsonResponseMessage(validate.error.message, validate.error.code)
    const userId = validate.data.userId
    const { data: isAdmin, error: isAdminError } = await userIsAdmin(userId, supabaseAdmin)
    if (isAdminError) return jsonResponseMessage(isAdminError.message, isAdminError.code)
    if (!isAdmin) return jsonResponseMessage('only admins can broadcast messages!', 403)

    console.info(`${userId} broadcast "${message}" to ${user_ids.join(', ')}`)
    await sendNotifications(supabaseAdmin, user_ids, { title: message }, 60*60) // 1 hour

    return jsonResponseMessage('message broadcast', 200)
  } catch (rawError) {
    return manageRawError(rawError)
  }
})
