import { createClient } from '@supabase/supabase-js'
import { Database } from '../_shared/database.types.ts'
import nowInRome from '../_shared/nowInRome.ts'
import sendNotifications from '../_shared/sendNotifications.ts'

console.info(`Job "attendance-reminder" started!`)


const supabaseAdmin = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SECRET_JOBS_KEY')!
)

const NIR = new nowInRome()

// get active groups in current day of week
const groupsProm = supabaseAdmin.from('groups')
  .select('id').contains('days_of_week', [NIR.dayOfWeek])
// check if today is a midweek holiday
const midweekHolidayProm = supabaseAdmin
  .from('midweek_holidays').select('date').eq('date', NIR.plainDate).maybeSingle()
// get who already set attendance
const attendancesProm = await supabaseAdmin.from('attendances')
  .select('user_id').eq('marked_day', NIR.plainDate)

const [groups, midweekHoliday, attendances] = (
  await Promise.all([groupsProm, midweekHolidayProm, attendancesProm])
)
if (groups.error) throw groups.error
if (midweekHoliday.error) throw midweekHoliday.error
if (attendances.error) throw attendances.error

// if it is a midweek holiday, all groups are inactive
const isMidweekHoliday = !!midweekHoliday.data
const groups_ids = isMidweekHoliday ? [] : groups.data.map((group) => group.id)
console.info(groups_ids.length + ' active groups')
if (isMidweekHoliday) console.info('It is a midweek holiday')

const ASA_users_ids = attendances.data.map((attendance) => attendance.user_id)
console.info(ASA_users_ids.length + ' users already set attendance')

if (groups_ids.length < 1) {
  console.info(`Job "attendance-reminder" finished! early exit`)
  Deno.exit()
}

// get profiles of active groups (exclude who already set attendance)
const profiles = await supabaseAdmin.from('profiles')
  .select('id').in('group_id', groups_ids).not('id', 'in', `(${ASA_users_ids.join(',')})`)
if (profiles.error) throw profiles.error
const NSA_profiles_ids = profiles.data.map((profile) => profile.id)
console.info(NSA_profiles_ids.length + ' users have not set attendance')

await sendNotifications(supabaseAdmin, NSA_profiles_ids,
                        'Eri presente in piscina? Segna la presenza!')

console.info(`Job "attendance-reminder" finished!`)
