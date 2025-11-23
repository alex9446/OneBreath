import { createResource, For, Show, type Component } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import type { Tables } from '../../utils/database.types'
import { useSupabase } from '../../utils/context'
import GroupName from '../../components/GroupName'
import Athlete from './athletes/Athlete'
import GoBack from '../../components/GoBack'
import './Athletes.sass'

type AthleteCardProfile = Pick<Tables<'profiles'>, 'id' | 'first_name' | 'last_name' | 'group_id'>

const AthleteCard: Component<{ profile: AthleteCardProfile, isAdmin: boolean }> = (props) => {
  const navigate = useNavigate()

  return (
    <article onClick={() => navigate(props.profile.id)}>
      <h5>{props.profile.first_name} {props.profile.last_name}{props.isAdmin ? ' ⭐' : ''}</h5>
      <p><GroupName id={props.profile.group_id} /></p>
    </article>
  )
}

const Athletes = () => {
  const supabaseClient = useSupabase()
  const params = useParams()

  const [profiles] = createResource(async () => {
    const { data: profiles, error } = await supabaseClient.from('profiles')
      .select('id,first_name,last_name,group_id').order('first_name')
    if (error) throw error.message
    return profiles
  })

  const [admins, { refetch }] = createResource(async () => {
    const { data: admins, error } = await supabaseClient.from('admins')
      .select('id')
    if (error) throw error.message
    return admins.map((admin) => admin.id)
  })

  const profileById = (id: string) => profiles()?.find((p) => p.id === id)
  const isAdmin = (id: string) => admins()?.includes(id) ?? false

  return (<>
    <Show when={params.id} fallback={
      <main id='athletes-page'>
        <For each={profiles()} fallback={<p>Caricamento atleti...</p>}>
          {(profile) => <AthleteCard profile={profile} isAdmin={isAdmin(profile.id)} />}
        </For>
      </main>
    }>
      {(userId) => (
        <Show when={profileById(userId())}>
          {(profile) => <Athlete profile={profile()} admin={isAdmin(userId())} adminsRefetch={refetch} />}
        </Show>
      )}
    </Show>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default Athletes
