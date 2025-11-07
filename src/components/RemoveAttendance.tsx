import type { Component } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import invokeAttendances from '../utils/invokeAttendances'
import ErrorBox from '../components/ErrorBox'

const RemoveAttendance: Component<{ groupId: number, refetch: Function }> = (props) => {
  const supabaseClient = useSupabase()

  const remove = action(async (groupId: number) => {
    const data = await invokeAttendances(supabaseClient, 'remove', groupId)
    if (data.code !== 200) throw data.message
    await props.refetch()
  })
  const useRemove = useAction(remove)
  const submission = useSubmission(remove)
  const onClickEvent = () => {
    submission.clear() // workaround to remove the last submission error
    useRemove(props.groupId)
  }

  return (
    <>
      <button onClick={onClickEvent} disabled={submission.pending}>
        {submission.pending ? 'Annullo...' : 'Annulla'}
      </button>
      <ErrorBox>{submission.error}</ErrorBox>
    </>
  )
}

export default RemoveAttendance
