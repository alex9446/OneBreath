import { createSignal, Show } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import { currentMonth } from '../../utils/mixed'
import { useSupabase } from '../../utils/supabaseContext'
import { useUserId } from '../../utils/userIdContext'
import Title from '../../components/Title'
import ErrorBox from '../../components/ErrorBox'
import GoBack from '../../components/GoBack'

const PoolPayment = () => {
  const nextMonth = (currentMonth() % 12) + 1
  const isSummer = nextMonth > 5 && nextMonth < 10
  const nextMonthStr = String(isSummer ? 10 : nextMonth).padStart(2, '0')
  const deadlines = {
    '1m': `2026-${nextMonthStr}-10`,
    '4m': '2026-10-10',
    '12m': '2026-10-10'
  }

  const supabaseClient = useSupabase()
  const userId = useUserId()
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
