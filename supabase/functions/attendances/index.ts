import { createClient } from '@supabase/supabase-js'
import { AttendancesExtra } from '@shared/functions.types.ts'
import type { Database } from '@shared/database.types.ts'
import { getDenoEnv, isInteger } from '@shared/mixed.ts'
import { createJsonResponseMessage } from '../_shared/jsonResponse.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { validateUser } from '../_shared/validateUser.ts'
import { allowedAttendance } from './allowedAttendance.ts'
import { removeAttendance } from './removeAttendance.ts'
import { setAttendance } from './setAttendance.ts'
import { manageRawError } from '../_shared/manageRawError.ts'

const validActionsList = ['remove', 'verify', 'set', 'make_coffee'] as const
type ValidActions = typeof validActionsList[number]
const isValidAction = (action: unknown): action is ValidActions => validActionsList.includes(action as ValidActions)

const jsonResponseMessage = createJsonResponseMessage<AttendancesExtra>()

console.info(`Edge function "attendances" up and running!`)


// All comments starting with @uml refer to the activity diagram

Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // @uml - payload valid?
    const { action, group } = await req.json()
    if (!isValidAction(action)) return jsonResponseMessage('action not valid!', 400)
    if (!isInteger(group)) return jsonResponseMessage('group is not an integer!', 400)

    const supabaseAdmin = createClient<Database>(
      getDenoEnv('SUPABASE_URL'),
      getDenoEnv('SECRET_FUNCTIONS_KEY')
    )

    // @uml - user valid?
    const validate = await validateUser(req.headers.get('Authorization'), supabaseAdmin)
    if (validate.error) return jsonResponseMessage(validate.error.message, validate.error.code)
    const userId = validate.data.userId

    // @uml - can set attendance?
    const allowed = await allowedAttendance(supabaseAdmin, group, userId)
    if (allowed.error) return jsonResponseMessage(allowed.error.message, allowed.error.code)

    if (action === 'remove' && allowed.data.state === 'already-set') {
      const removed = await removeAttendance(supabaseAdmin, allowed.data.daySettedPlainDate, userId)
      if (removed.error) return jsonResponseMessage(removed.error.message, removed.error.code)
      return jsonResponseMessage('attendance removed', 200)
    }

    const allowedCode = action === 'verify' ? 200 : 403
    if (allowed.data.state === 'already-set') return jsonResponseMessage('attendance already set!', allowedCode, allowed.data)
    if (allowed.data.state === 'day-not-allowed') return jsonResponseMessage('day not allowed!', allowedCode, allowed.data)
    if (action === 'remove') return jsonResponseMessage('no attendance already recorded', 403, allowed.data)
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
