import { createSignal, Show, type Component } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import invokeAttendances from '../utils/invokeAttendances'

const SetAttendance: Component<{ groupId: number, refetch: Function }> = (props) => {
  const [sending, setSending] = createSignal(false)
  const supabaseClient = useSupabase()

  const set = action(async (groupId: number) => {
    const data = await invokeAttendances(supabaseClient, 'set', groupId)
    if (data.code !== 200) throw data.message
    props.refetch()
  })
  const useSet = useAction(set)
  const submissions = useSubmission(set)

  const onClickEvent = () => {
    setSending(true)
    useSet(props.groupId)
  }

  return (
    <>
      <button onClick={onClickEvent} disabled={sending()}>
        {sending() ? 'Invio...' : 'Si'}
      </button>
      <Show when={typeof submissions.error === 'string'}>
        <p class='error-box'>{submissions.error}</p>
      </Show>
    </>
  )
}

export default SetAttendance
