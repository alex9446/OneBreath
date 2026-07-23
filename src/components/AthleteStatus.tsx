import { createResource } from 'solid-js'
import { A } from '@solidjs/router'
import { useSupabase } from '../utils/supabaseContext'
import { useUserId } from '../utils/userIdContext'
import { userStatus } from '../utils/mixed.supabase'
import { mdiCashSync, mdiClipboardPulseOutline } from '../utils/iconPaths'
import Icon from './Icon'
import './AthleteStatus.sass'

const AthleteStatus = () => {
  const supabaseClient = useSupabase()
  const userId = useUserId()

  const [status] = createResource(() => userStatus(supabaseClient, userId))

  return (
    <A href='/status'
       class='athlete-status' classList={status()?.global}>
      <p>Stato profilo:</p>
      <Icon path={mdiClipboardPulseOutline} title='stato certificato'
            classList={status()?.certificate} />
      <Icon path={mdiCashSync} title='stato pagamento piscina'
            classList={status()?.payment} />
    </A>
  )
}

export default AthleteStatus
