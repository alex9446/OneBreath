import { createClient } from '@supabase/supabase-js'
import { LeaderboardExtra } from '@shared/functions.types.ts'
import type { Database } from '@shared/database.types.ts'
import { getDenoEnv, isInteger } from '@shared/mixed.ts'
import { createJsonResponseMessage } from '../_shared/jsonResponse.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { validateUser } from '../_shared/validateUser.ts'
import { manageRawError } from '../_shared/manageRawError.ts'

const FIRST_SEASON = 2025
const currentYear = () => Temporal.Now.plainDateISO('Europe/Rome').year

const isValidSeason = (season: unknown): season is number => (
  isInteger(season) && (season >= FIRST_SEASON || season <= currentYear())
)
const jsonResponseMessage = createJsonResponseMessage<LeaderboardExtra>()

console.info(`Edge function "leaderboard" up and running!`)


Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { group, season } = await req.json()
    if (!isInteger(group)) return jsonResponseMessage('group is not an integer!', 400)
    if (typeof season !== 'undefined' && !isValidSeason(season)) return jsonResponseMessage(
      `the season (if specified) must fall between ${FIRST_SEASON} and ${currentYear()}`, 400
    )

    const supabaseAdmin = createClient<Database>(
      getDenoEnv('SUPABASE_URL'),
      getDenoEnv('SECRET_FUNCTIONS_KEY')
    )

    const validate = await validateUser(req.headers.get('Authorization'), supabaseAdmin)
    if (validate.error) return jsonResponseMessage(validate.error.message, validate.error.code)

    const [minYear, maxYear] = [season ?? FIRST_SEASON, (season ?? currentYear()) + 1]

    const leaderboard = await supabaseAdmin.rpc('get_leaderboard', {
      group_id_param: group,
      min_date: `${minYear}-09-01`,
      max_date: `${maxYear}-08-31`
    })
    if (leaderboard.error) return jsonResponseMessage(leaderboard.error.message, 500)

    return jsonResponseMessage('leaderboard', 200, leaderboard.data)
  } catch (rawError) {
    return manageRawError(rawError)
  }
})
