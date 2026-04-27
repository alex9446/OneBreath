import { createResource, For, type Component } from 'solid-js'
import { useSupabase } from '../../../../utils/context'
import Title from '../../../../components/Title'

const Subscriptions: Component<{ userId: string }> = (props) => {
  const supabaseClient = useSupabase()

  const [subscriptions] = createResource(async () => {
    const { data: subscriptions, error } = await supabaseClient.from('subscriptions')
      .select('last_status_code,last_send_at').eq('user_id', props.userId)
    if (error) throw error.message
    return subscriptions
  })

  return (<>
    <Title>Sottoscizioni alle notifiche</Title>
    <main id='subscriptions-page'>
      <For each={subscriptions()}>
        {(subscription) => (
          <article>
            <p>{subscription.last_send_at}</p><p>{subscription.last_status_code}</p>
          </article>
        )}
      </For>
    </main>
  </>)
}

export default Subscriptions
