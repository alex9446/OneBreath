import { createResource, createSignal, For, Show } from 'solid-js'
import { useParams } from '@solidjs/router'
import { useSupabase } from '../../utils/context'
import Title from '../../components/Title'
import FilterProfiles from '../../components/FilterProfiles'
import AthleteCard from '../../components/AthleteCard'
import Athlete from './athletes/Athlete'
import GoBack from '../../components/GoBack'
import './Athletes.sass'

const Athletes = () => {
  const supabaseClient = useSupabase()
  const params = useParams()
  const [selectedGroup, setSelectedGroup] = createSignal(0)

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
    <Title>Area staff &gt; Atleti</Title>
    <Show when={params.id} fallback={
      <main id='athletes-page'>
        <FilterProfiles profiles={profiles() ?? []} set={setSelectedGroup}
                        defaultOption={selectedGroup()} />
        <For each={profiles()} fallback={<p>Caricamento atleti...</p>}>
          {(profile) => (
            <Show when={selectedGroup() === 0 || selectedGroup() === profile.group_id}>
              <AthleteCard profile={profile} isAdmin={isAdmin(profile.id)} />
            </Show>
          )}
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
