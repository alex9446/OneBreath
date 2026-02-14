import { createResource, Match, Suspense, Switch, type Component } from 'solid-js'
import { getDateLocaleIT } from '../utils/mixed'
import { useSupabase } from '../utils/context'
import { userStatus } from '../utils/mixed.supabase'
import Title from '../components/Title'
import FakeButton from '../components/FakeButton'
import GoBack from '../components/GoBack'
import './Status.sass'

type ExpirationProps = {
  status: {
    notfound: boolean
    expired: boolean
    almostExpired: boolean
  } | undefined
  date: string | undefined
}
const ExpirationInfo: Component<ExpirationProps> = (props) => {
  const date = () => props.date && getDateLocaleIT(props.date)

  return (
    <p>
      <Switch fallback={
        `Scadrà il ${date()}`
      }>
        <Match when={props.status?.expired}>
          Scaduto il {date()}
        </Match>
        <Match when={props.status?.almostExpired}>
          Scadrà a breve, il {date()}
        </Match>
        <Match when={props.status?.notfound}>
          Non presente
        </Match>
      </Switch>
    </p>
  )
}

const Status = () => {
  const supabaseClient = useSupabase()
  const [status] = createResource(() => userStatus(supabaseClient))

  return (<>
    <Title>Stato profilo</Title>
    <main id='status-page'>
      <article classList={status()?.certificate}>
        <h3>Stato certificato</h3>
        <Suspense fallback={<p>Caricamento scadenza...</p>}>
          <ExpirationInfo status={status()?.certificate}
                          date={status()?.certificateExpiration} />
        </Suspense>
        <FakeButton href='/sportexam/uploadcertificate'>Carica certificato</FakeButton>
      </article>
      <hr />
      <article classList={status()?.payment}>
        <h3>Stato pagamento piscina</h3>
        <Suspense fallback={<p>Caricamento scadenza...</p>}>
          <ExpirationInfo status={status()?.payment}
                          date={status()?.paymentExpiration} />
        </Suspense>
        <FakeButton href='/payments/poolpayment'>Conferma pagamento piscina</FakeButton>
      </article>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default Status
