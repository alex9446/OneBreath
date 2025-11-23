import type { Component } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import type { Tables } from '../../../utils/database.types'
import { useSupabase } from '../../../utils/context'
import { getUserId } from '../../../utils/mixed.supabase'
import ErrorBox from '../../../components/ErrorBox'
import UserAttendances from '../../../components/UserAttendances'
import './Athlete.sass'

type AthleteProps = {
  profile: Pick<Tables<'profiles'>, 'id' | 'first_name' | 'last_name' | 'group_id'>
  admin: boolean
  adminsRefetch: () => void
}

const Athlete: Component<AthleteProps> = (props) => {
  const supabaseClient = useSupabase()

  const insertAdmin = action(async () => {
    const currentAdminId = await getUserId(supabaseClient)
    const { error } = await supabaseClient.from('admins').insert([
      { id: props.profile.id, added_by: currentAdminId }
    ])
    if (error) throw error.message
    await props.adminsRefetch()
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
        {props.admin ? 'Già in staff' : 'Aggiungi a staff'}
      </button>
      <ErrorBox>{submission.error}</ErrorBox>
      <UserAttendances id={props.profile.id} />
    </main>
  )
}

export default Athlete
