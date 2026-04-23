import { validate as validateUUID } from 'uuid'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../_shared/database.types.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { jsonResponseMessage } from '../_shared/jsonResponse.ts'
import { userIsAdmin, validateUser } from '../_shared/validateUser.ts'
import sendNotifications from '../_shared/sendNotifications.ts'
import { manageRawError } from '../_shared/manageRawError.ts'

console.info(`Edge function "broadcast" up and running!`)


Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { user_ids, message } = await req.json()
    if (!(Array.isArray(user_ids) && user_ids.every(validateUUID))) {
      return jsonResponseMessage('user_ids is not a valid list of UUID!', 400)
    }
    if (typeof message !== 'string') return jsonResponseMessage('message is not a string!', 400)

    const supabaseAdmin = createClient<Database>(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SECRET_FUNCTIONS_KEY')!
    )

    const validate = await validateUser(req.headers.get('Authorization'), supabaseAdmin)
    if (validate.error) return jsonResponseMessage(validate.error.message, validate.error.code)
    const userId = validate.data.userId
    const { data: isAdmin, error: isAdminError } = await userIsAdmin(userId, supabaseAdmin)
    if (isAdminError) return jsonResponseMessage(isAdminError.message, isAdminError.code)
    if (!isAdmin) return jsonResponseMessage('only admins can broadcast messages!', 403)

    console.info(`${userId} broadcast "${message}" to ${user_ids.join(', ')}`)
    await sendNotifications(supabaseAdmin, user_ids, message)

    return jsonResponseMessage('message broadcast', 200)
  } catch (rawError) {
    return manageRawError(rawError)
  }
})
