import { Show, type Component } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import { getDateLocaleIT, type userStatusRaw } from '../../../utils/mixed'
import type { Tables } from '../../../utils/database.types'
import { useSupabase } from '../../../utils/context'
import { getUserId } from '../../../utils/mixed.supabase'
import ErrorBox from '../../../components/ErrorBox'
import DownloadCertButton from '../../../components/DownloadCertButton'
import UserAttendances from '../../../components/UserAttendances'
import './Athlete.sass'

const ExpirationInfo: Component<{ name: string, expiration?: string }> = (props) => {
  const expiration = props.expiration ? getDateLocaleIT(props.expiration) : 'non caricato'
  return <p>Scadenza {props.name}: {expiration}</p>
}

const confirmMessage = (name: string) => `
Confermi di voler elevare ${name} a staff?
L'azione non è annullabile!

Affinche la modifica sia visibile, ${name} dovrà effettuare nuovamente il login
`.trim()

type AthleteProps = {
  profile: Pick<Tables<'profiles'>, 'id' | 'first_name' | 'last_name'> & {
    status: ReturnType<typeof userStatusRaw>
  }
  admin: boolean
  adminsRefetch: () => void
}

const Athlete: Component<AthleteProps> = (props) => {
  const supabaseClient = useSupabase()

  const insertAdmin = action(async () => {
    if (!window.confirm(confirmMessage(props.profile.first_name))) return false
    const currentAdminId = await getUserId(supabaseClient)
    const { error } = await supabaseClient.from('admins').insert([
      { id: props.profile.id, added_by: currentAdminId }
    ])
    if (error) throw error.message
    await props.adminsRefetch()
    return true
  })
  const useInsertAdmin = useAction(insertAdmin)
  const submission = useSubmission(insertAdmin)
  const insertAdminClick = () => {
    submission.clear() // workaround to remove the last submission error
    useInsertAdmin()
  }

  return (
    <main id='athlete-page'>
      <p>Presenze di {props.profile.first_name} {props.profile.last_name}</p>
      <button class='add-admin' disabled={props.admin || submission.pending}
              onClick={insertAdminClick}>
        {props.admin ? (submission.result ? 'Fatto!' : 'Già in staff') : 'Aggiungi a staff'}
      </button>
      <ErrorBox>{submission.error}</ErrorBox>
      <ExpirationInfo name='certificato' expiration={props.profile.status.certificateExpiration} />
      <Show when={!props.profile.status.certificate.notfound}>
        <DownloadCertButton userId={props.profile.id} />
      </Show>
      <ExpirationInfo name='pagamento piscina' expiration={props.profile.status.paymentExpiration} />
      <UserAttendances id={props.profile.id} />
    </main>
  )
}

export default Athlete
