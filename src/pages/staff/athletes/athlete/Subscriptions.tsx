import { createResource, For, Show, type Component } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import { getDateTimeLocaleIT } from '../../../../utils/mixed'
import { useSupabase } from '../../../../utils/context'
import invokeBroadcast from '../../../../utils/invokeBroadcast'
import Title from '../../../../components/Title'
import ErrorBox from '../../../../components/ErrorBox'
import './Subscriptions.sass'

const getDateOrMessage = (date: string | null) => (
  date ? getDateTimeLocaleIT(date) : 'Nuova sottoscrizione'
)

const Subscriptions: Component<{ userId: string }> = (props) => {
  const supabaseClient = useSupabase()

  const [subscriptions] = createResource(async () => {
    const { data: subscriptions, error } = await supabaseClient.from('subscriptions')
      .select('last_status_code,last_send_at').eq('user_id', props.userId).order('created_at')
    if (error) throw error.message
    return subscriptions.map((sub) => ({
      ...sub,
      last_status_bool: {
        good: sub.last_status_code === 201,
        bad: sub.last_status_code === 410
      }
    }))
  })

  const handleTest = action(async () => {
    const data = await invokeBroadcast(supabaseClient, [props.userId], 'Notifica di test!!')
    if (data.code !== 200) throw data.message
    return { ok: true }
  })
  const useHandler = useAction(handleTest)
  const submission = useSubmission(handleTest)

  return (<>
    <Title>Sottoscrizioni alle notifiche</Title>
    <main id='subscriptions-page'>
      <Show when={subscriptions()?.length} fallback={
        <p>Nessuna sottoscrizione</p>
      }>
        <div class='grid'>
          <p>Ultimo invio</p><p>Stato</p>
          <For each={subscriptions()}>
            {(subscription) => (<>
              <p>{getDateOrMessage(subscription.last_send_at)}</p>
              <p classList={subscription.last_status_bool}>
                {subscription.last_status_code ?? '✨ NEW'}
              </p>
            </>)}
          </For>
        </div>
        <button onClick={useHandler} disabled={submission.pending || submission.result?.ok}>
          { submission.result?.ok ? 'Inviata!' : 'Invia notifica di test' }
        </button>
      </Show>
      <ErrorBox>{submission.error}</ErrorBox>
    </main>
  </>)
}

export default Subscriptions
