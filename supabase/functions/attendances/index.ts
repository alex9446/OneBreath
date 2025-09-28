// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js@2/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { Database } from '../_shared/database.types.ts'
import { jsonResponse, jsonResponseMessage } from './wrapped-response.ts'
import { validateUser } from './validate-user.ts'
import { allowedAttendance } from './allowed-attendance.ts'
import { setAttendance } from './set-attendance.ts'

const validActions = ['verify', 'set', 'make_coffee']

console.info(`Edge function "attendances" up and running!`)


Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') return new Response('ok')

  try {
    // check payload
    const { action, group } = await req.json()
    if (!validActions.includes(action)) return jsonResponseMessage('action not valid!', 400)
    if (!Number.isInteger(group)) return jsonResponseMessage('group is not an integer!', 400)

    const supabaseAdmin = createClient<Database>(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SECRET_FUNCTIONS_KEY')!
    )

    // user valid?
    const validate = await validateUser(req, supabaseAdmin)
    if (validate.code !== 200) return jsonResponseMessage(validate.message, validate.code)
    const userId = validate.userId ?? ''

    const nowInRome = Temporal.Now.zonedDateTimeISO('Europe/Rome')

    // can set attendance?
    const allowed = await allowedAttendance(supabaseAdmin, group, nowInRome, userId)
    if (allowed.code !== 200) return jsonResponseMessage(allowed.message, allowed.code,
                                                         {group_setted: allowed.groupSetted})

    if (action === 'verify') return jsonResponseMessage('attendance markable', 200,
                                                        { day_of_week: nowInRome.dayOfWeek })
    // attendance setted?
    if (action === 'set') {
      const setted = await setAttendance(supabaseAdmin, group, nowInRome, userId)
      return jsonResponseMessage(setted.message, setted.code)
    }

    return jsonResponseMessage('I\'m a teapot', 418)
  } catch (rawError) {
    const msgInError = rawError instanceof Object && 'message' in rawError
    return jsonResponse({ catched_error: msgInError ? rawError.message : rawError }, 500)
  }
})
