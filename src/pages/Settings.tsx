import { createResource } from 'solid-js'
import { action, redirect, useSubmission } from '@solidjs/router'
import { FormManager, getGroupFromLS, setGroupInLS } from '../utils/mixed'
import { useSupabase } from '../utils/context'
import { getUserId } from '../utils/mixed.supabase'
import Title from '../components/Title'
import SelectGroup from '../components/SelectGroup'
import Checkbox from '../components/Checkbox'
import ErrorBox from '../components/ErrorBox'
import FakeButton from '../components/FakeButton'
import GoBack from '../components/GoBack'

const Settings = () => {
  const groupId = getGroupFromLS()
  const supabaseClient = useSupabase()
  const userIdPromise = getUserId(supabaseClient)

  const [leaderboard] = createResource(async () => {
    const { data: profile, error } = await supabaseClient.from('profiles')
      .select('leaderboard').eq('id', await userIdPromise).single()
    if (error) throw error.message
    return profile.leaderboard
  })

  const saveSettings = action(async (formData: FormData) => {
    const formManager = new FormManager(formData)
    const group_id = parseInt(formManager.getString('group'))
    const leaderboard = formManager.getBoolean('leaderboard')
    const { error } = await supabaseClient.from('profiles')
      .update({ group_id, leaderboard }).eq('id', await userIdPromise)
    if (error) throw error.message
    setGroupInLS(group_id)
    throw redirect('/')
  })
  const submission = useSubmission(saveSettings)

  return (<>
    <Title>Impostazioni</Title>
    <main id='settings-page'>
      <form method='post' action={saveSettings}>
        <SelectGroup defaultOption={groupId} />
        <Checkbox name='leaderboard'
                  checked={leaderboard()}>Mostrami nella classifica presenze</Checkbox>
        <input type='submit' value='Salva' disabled={submission.pending} />
      </form>
      <ErrorBox>{submission.error}</ErrorBox>
    </main>
    <nav>
      <FakeButton href='changepassword'>Cambia password</FakeButton>
      <FakeButton href='notifications'>Notifiche</FakeButton>
      <GoBack />
    </nav>
  </>)
}

export default Settings
