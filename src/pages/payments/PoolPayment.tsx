import { createSignal, Show } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import { useSupabase } from '../../utils/supabaseContext'
import { useUserId } from '../../utils/userIdContext'
import { poolPaymentDeadlines } from '../../utils/mixed'
import Title from '../../components/Title'
import ErrorBox from '../../components/ErrorBox'
import GoBack from '../../components/GoBack'

const PoolPayment = () => {
  const supabaseClient = useSupabase()
  const userId = useUserId()
  const deadlines = poolPaymentDeadlines()
  const [nextDeadline, setNextDeadline] = createSignal(deadlines['1m'])

  const upsertPayment = action(async () => {
    const { error } = await supabaseClient.from('payments')
      .upsert({ user_id: userId, expiration: nextDeadline() })
    if (error) throw error.message
    return { ok: true }
  })
  const useUpsertPayment = useAction(upsertPayment)
  const submission = useSubmission(upsertPayment)

  return (<>
    <Title>Conferma pagamento piscina</Title>
    <main id='poolpayment-page'>
      <Show when={submission.result?.ok} fallback={<>
        <p style='text-align: center'>Conferma pagamento piscina</p>
        <select onInput={(e) => setNextDeadline(e.currentTarget.value)}>
          <option value={deadlines['1m']}>Mensile</option>
          <option value={deadlines['4m']}>Quadrimestrale</option>
          <option value={deadlines['12m']}>Annuale</option>
        </select>
        <p>Prossima scadenza: {nextDeadline()}</p>
        <button onClick={useUpsertPayment} disabled={submission.pending}>Conferma</button>
      </>}>
        <p style='color:green'>Conferma inviata!</p>
      </Show>
      <ErrorBox>{submission.error}</ErrorBox>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default PoolPayment
