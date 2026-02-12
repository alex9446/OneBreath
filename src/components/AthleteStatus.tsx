import { createResource } from 'solid-js'
import { A } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import { diffDays, getTodayDate } from '../utils/mixed'
import { getUserId } from '../utils/mixed.supabase'
import { mdiClipboardPulseOutline } from '../utils/iconPaths'
import Icon from './Icon'
import './AthleteStatus.sass'

const AthleteStatus = () => {
  const supabaseClient = useSupabase()
  const today = getTodayDate()

  const [status] = createResource(async () => {
    const userId = await getUserId(supabaseClient)
    const { data, error } = await supabaseClient.from('certificates')
      .select('expiration').eq('user_id', userId).maybeSingle()
    if (error) throw error.message

    return {
      certificate: {
        notfound: data === null,
        expired: data ? (diffDays(today, data.expiration) < 0) : false,
        almostExpired: data ? (diffDays(today, data.expiration) < 30) : false
      }
    }
  })

  return (
    <A href='/sportexam/uploadcertificate'
       class='athlete-status' classList={status()?.certificate}>
      <p>Stato profilo:</p>
      <Icon path={mdiClipboardPulseOutline} title='stato certificato'
            classList={status()?.certificate} />
    </A>
  )
}

export default AthleteStatus
