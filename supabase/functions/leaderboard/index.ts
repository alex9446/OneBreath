import { createClient } from '@supabase/supabase-js'
import { LeaderboardExtra } from '@shared/functions.types.ts'
import type { Database } from '@shared/database.types.ts'
import { getDenoEnv, isInteger } from '@shared/mixed.ts'
import { createJsonResponseMessage } from '../_shared/jsonResponse.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { validateUser } from '../_shared/validateUser.ts'
import { manageRawError } from '../_shared/manageRawError.ts'

const jsonResponseMessage = createJsonResponseMessage<LeaderboardExtra>()

console.info(`Edge function "leaderboard" up and running!`)


Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { group } = await req.json()
    if (!isInteger(group)) return jsonResponseMessage('group is not an integer!', 400)

    const supabaseAdmin = createClient<Database>(
      getDenoEnv('SUPABASE_URL'),
      getDenoEnv('SECRET_FUNCTIONS_KEY')
    )

    const validate = await validateUser(req.headers.get('Authorization'), supabaseAdmin)
    if (validate.error) return jsonResponseMessage(validate.error.message, validate.error.code)

    const { data: leaderboard, error } = await supabaseAdmin.from('leaderboard')
      .select('first_name,last_name,apg').eq('group_id', group)
    if (error) return jsonResponseMessage(error.message, 500)

    return jsonResponseMessage('leaderboard', 200, leaderboard)
  } catch (rawError) {
    return manageRawError(rawError)
  }
})
