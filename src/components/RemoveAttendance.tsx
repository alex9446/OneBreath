import type { Component } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import invokeAttendances from '../utils/invokeAttendances'
import ErrorBox from '../components/ErrorBox'

const RemoveAttendance: Component<{ groupId: number, refetch: () => void }> = (props) => {
  const supabaseClient = useSupabase()

  const remove = action(async () => {
    const data = await invokeAttendances(supabaseClient, 'remove', props.groupId)
    if (data.code !== 200) throw data.message
    await props.refetch()
    return { ok: true }
  })
  const useRemove = useAction(remove)
  const submission = useSubmission(remove)

  return (
    <>
      <button onClick={useRemove} disabled={submission.pending}>
        {submission.pending ? 'Annullo...' : 'Annulla'}
      </button>
      <ErrorBox>{submission.error}</ErrorBox>
    </>
  )
}

export default RemoveAttendance
