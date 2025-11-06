// Setup type definitions for built-in Supabase Runtime APIs
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../_shared/database.types.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { jsonResponseMessage } from '../_shared/jsonResponse.ts'
import { validateUser } from '../_shared/validateUser.ts'
import { allowedAttendance } from './allowedAttendance.ts'
import { setAttendance } from './setAttendance.ts'
import { manageRawError } from '../_shared/manageRawError.ts'

const validActions = ['verify', 'set', 'make_coffee']

console.info(`Edge function "attendances" up and running!`)


// All comments starting with @uml refer to the activity diagram

Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // @uml - payload valid?
    const { action, group } = await req.json()
    if (!validActions.includes(action)) return jsonResponseMessage('action not valid!', 400)
    if (!Number.isInteger(group)) return jsonResponseMessage('group is not an integer!', 400)

    const supabaseAdmin = createClient<Database>(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SECRET_FUNCTIONS_KEY')!
    )

    // @uml - user valid?
    const validate = await validateUser(req.headers.get('Authorization'), supabaseAdmin)
    if (validate.error) return jsonResponseMessage(validate.error.message, validate.error.code)
    const userId = validate.data.userId

    // @uml - can set attendance?
    const allowed = await allowedAttendance(supabaseAdmin, group, userId)
    if (allowed.error) return jsonResponseMessage(allowed.error.message, allowed.error.code)

    const allowedCode = action === 'verify' ? 200 : 403
    if (allowed.data.alreadySet) return jsonResponseMessage('attendance already set!', allowedCode, allowed.data)
    if (allowed.data.DTnotAllowed) return jsonResponseMessage('day or time not allowed!', allowedCode, allowed.data)
    if (action === 'verify') return jsonResponseMessage('attendance markable', 200, allowed.data)

    if (action === 'set') {
      // @uml - attendance setted?
      const setted = await setAttendance(supabaseAdmin, group, allowed.data.dayToMarkPlainDate, userId)
      if (setted.error) return jsonResponseMessage(setted.error.message, setted.error.code)
      return jsonResponseMessage('attendance marked', 200)
    }

    return jsonResponseMessage('I\'m a teapot', 418)
  } catch (rawError) {
    return manageRawError(rawError)
  }
})
