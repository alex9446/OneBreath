import { createResource, For, type Component } from 'solid-js'
import type { Tables } from '../../utils/database.types'
import { useSupabase } from '../../utils/context'
import GroupName from '../../components/GroupName'
import FakeButton from '../../components/FakeButton'
import './Athletes.sass'

type AthleteCardProfile = Pick<Tables<'profiles'>, 'first_name' | 'last_name' | 'group_id'>

const AthleteCard: Component<{ profile: AthleteCardProfile }> = (props) => (
  <article>
    <h5>{props.profile.first_name} {props.profile.last_name}</h5>
    <p><GroupName id={props.profile.group_id} /></p>
  </article>
)

const Athletes = () => {
  const supabaseClient = useSupabase()

  const [profiles] = createResource(async () => {
    const { data: profiles, error } = await supabaseClient.from('profiles')
      .select('first_name,last_name,group_id').order('first_name')
    if (error) throw error.message
    return profiles
  })

  return (<>
    <main id='athletes-page'>
      <For each={profiles()} fallback={<p>Caricamento atleti...</p>}>
        {(profile) => <AthleteCard profile={profile} />}
      </For>
    </main>
    <footer>
      <FakeButton href='/staff'>Torna indietro</FakeButton>
    </footer>
  </>)
}

export default Athletes
