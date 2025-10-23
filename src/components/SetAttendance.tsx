import type { Component } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import invokeAttendances from '../utils/invokeAttendances'
import ErrorBox from '../components/ErrorBox'

const SetAttendance: Component<{ groupId: number, refetch: Function }> = (props) => {
  const supabaseClient = useSupabase()

  const set = action(async (groupId: number) => {
    const data = await invokeAttendances(supabaseClient, 'set', groupId)
    if (data.code !== 200) throw data.message
    props.refetch()
  })
  const useSet = useAction(set)
  const submissions = useSubmission(set)

  const onClickEvent = () => useSet(props.groupId)

  return (
    <>
      <button onClick={onClickEvent} disabled={submissions.pending}>
        {submissions.pending ? 'Invio...' : 'Si'}
      </button>
      <ErrorBox>{submissions.error}</ErrorBox>
    </>
  )
}

export default SetAttendance
