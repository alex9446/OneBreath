import { createResource } from 'solid-js'
import { action, redirect, useSubmission } from '@solidjs/router'
import { getGroupFromLS, setGroupInLS } from '../utils/mixed'
import { useSupabase } from '../utils/context'
import SelectGroup from '../components/SelectGroup'
import ErrorBox from '../components/ErrorBox'
import FakeButton from '../components/FakeButton'
import LogoutButton from '../components/LogoutButton'
import './Settings.sass'

const Settings = () => {
  const groupId = getGroupFromLS()
  const supabaseClient = useSupabase()

  const [profile] = createResource(async () => {
    const { data: profile, error } = await supabaseClient.from('profiles').select('id,leaderboard').single()
    if (error) throw error.message
    return profile
  })

  const saveSettings = action(async (formData: FormData) => {
    const id = formData.get('id')!.toString()
    const group_id = parseInt(formData.get('group')!.toString())
    const leaderboard = formData.get('leaderboard') ? true : false
    const { error } = await supabaseClient.from('profiles').update({group_id, leaderboard}).eq('id', id)
    if (error) throw error.message
    setGroupInLS(group_id)
    throw redirect('/')
  })
  const submission = useSubmission(saveSettings)

  return (<>
    <main id='settings-page'>
      <form method='post' action={saveSettings}>
        <input type='hidden' name='id' value={profile()?.id} required />
        <SelectGroup defaultOption={groupId} />
        <div class='checkbox-input'>
          <input type='checkbox' name='leaderboard' id='leaderboard' checked={profile()?.leaderboard} />
          <label for='leaderboard'>Mostrami nella classifica presenze</label>
        </div>
        <input type='submit' value='Salva' disabled={submission.pending} />
      </form>
      <ErrorBox>{submission.error}</ErrorBox>
    </main>
    <footer>
      <LogoutButton />
      <FakeButton href='/settings/notifications'>Notifiche</FakeButton>
      <FakeButton href='/'>Torna indietro</FakeButton>
    </footer>
  </>)
}

export default Settings
