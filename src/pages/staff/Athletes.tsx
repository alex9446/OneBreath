import { createMemo, createResource, createSignal, For, Show } from 'solid-js'
import { useParams } from '@solidjs/router'
import { useSupabase } from '../../utils/context'
import { profilesWithStatus } from '../../utils/mixed.supabase'
import Title from '../../components/Title'
import FilterProfiles from '../../components/FilterProfiles'
import Checkbox from '../../components/Checkbox'
import AthleteCard from '../../components/AthleteCard'
import Athlete from './athletes/Athlete'
import GoBack from '../../components/GoBack'

const Athletes = () => {
  const supabaseClient = useSupabase()
  const params = useParams()
  const [selectedGroup, setSelectedGroup] = createSignal(0)
  const [expiredCertificates, setExpiredCertificates] = createSignal(false)
  const [expiredPayments, setExpiredPayments] = createSignal(false)

  const [profiles] = createResource(() => profilesWithStatus(supabaseClient))

  const [admins, { refetch }] = createResource(async () => {
    const { data: admins } = await supabaseClient.from('admins').select('id')
    return new Set(admins?.map((admin) => admin.id) ?? [])
  })

  const filteredProfiles = createMemo(() => (
    profiles()?.filter((profile) => (
      (selectedGroup() === 0 || selectedGroup() === profile.group_id) &&
      (!expiredCertificates() || expiredCertificates() === !profile.status.certificate.valid) &&
      (!expiredPayments() || expiredPayments() === !profile.status.payment.valid)
    ))
  ))

  const profileById = (id: string) => profiles()?.find((p) => p.id === id)
  const isAdmin = (id: string) => admins()?.has(id) ?? false

  return (<>
    <Title>Area staff &gt; Atleti</Title>
    <Show when={params.id} fallback={
      <main id='athletes-page' style='gap: 10px'>
        <FilterProfiles profiles={profiles() ?? []} set={setSelectedGroup}
                        defaultOption={selectedGroup()} />
        <section>
          <Checkbox set={setExpiredCertificates}
                    checked={expiredCertificates()}>certificato scaduto</Checkbox>
          <Checkbox set={setExpiredPayments}
                    checked={expiredPayments()}>pagamento scaduto</Checkbox>
        </section>
        <For each={filteredProfiles()} fallback={
          <p>{profiles.loading ? 'Caricamento atleti...' : 'Nessun atleta trovato'}</p>
        }>
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
