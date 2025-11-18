import type { Component } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import invokeAttendances from '../utils/invokeAttendances'
import ErrorBox from '../components/ErrorBox'

const SetAttendance: Component<{ groupId: number, refetch: () => void }> = (props) => {
  const supabaseClient = useSupabase()

  const set = action(async (groupId: number) => {
    const data = await invokeAttendances(supabaseClient, 'set', groupId)
    if (data.code !== 200) throw data.message
    await props.refetch()
  })
  const useSet = useAction(set)
  const submission = useSubmission(set)
  const onClickEvent = () => {
    submission.clear() // workaround to remove the last submission error
    useSet(props.groupId)
  }

  return (
    <>
      <button onClick={onClickEvent} disabled={submission.pending}>
        {submission.pending ? 'Invio...' : 'Si'}
      </button>
      <ErrorBox>{submission.error}</ErrorBox>
    </>
  )
}

export default SetAttendance
