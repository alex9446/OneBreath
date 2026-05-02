import { createResource, For, type Component } from 'solid-js'
import { useSupabase } from '../../../../utils/context'
import { getDateTimeLocaleIT } from '../../../../utils/mixed'
import Title from '../../../../components/Title'
import './Subscriptions.sass'

const Subscriptions: Component<{ userId: string }> = (props) => {
  const supabaseClient = useSupabase()

  const [subscriptions] = createResource(async () => {
    const { data: subscriptions, error } = await supabaseClient.from('subscriptions')
      .select('last_status_code,last_send_at').eq('user_id', props.userId)
    if (error) throw error.message
    return subscriptions.map((sub) => ({
      ...sub,
      last_status_bool: {
        good: sub.last_status_code === 201,
        bad: sub.last_status_code === 410
      }
    }))
  })

  return (<>
    <Title>Sottoscizioni alle notifiche</Title>
    <main id='subscriptions-page'>
      <p>Sottoscizioni alle notifiche</p>
      <div class='grid'>
        <p>Ultimo invio</p><p>Stato</p>
        <For each={subscriptions()}>
          {(subscription) => (<>
            <p>{getDateTimeLocaleIT(subscription.last_send_at ?? '')}</p>
            <p classList={subscription.last_status_bool}>{subscription.last_status_code}</p>
          </>)}
        </For>
      </div>
    </main>
  </>)
}

export default Subscriptions
