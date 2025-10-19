import { createResource, Match, Show, Switch } from 'solid-js'
import { FunctionsHttpError } from '@supabase/supabase-js'
import { useSupabase } from '../utils/context'
import { DayOfWeek } from './DayOfWeek'
import { GroupName } from './GroupName'

type verifyData = {
  message?: string,
  code: number,
  extra: {
    day_of_week?: number,
    group_setted?: number,
    day_setted?: number
  }
}

const Attendance = () => {
  const supabaseClient = useSupabase()!
  const group_id = parseInt(localStorage.getItem('group_id')!)

  const [verify] = createResource<verifyData>(async () => {
    const { data, error } = await supabaseClient.functions.invoke('attendances', {
      body: { 'action': 'verify', 'group': group_id }
    })
    if (error instanceof FunctionsHttpError) return await error.context.json()
    if (error) throw error
    return data
  })

  return (
    <Show when={verify()}>
      <Switch fallback={<p class='error-box'>Errore non gestito</p>}>
        <Match when={verify()!.code === 200 && 'day_of_week' in verify()!.extra}>
          <p>Eri presente <DayOfWeek day={(verify()!.extra.day_of_week!)-1} />
          &nbsp;a <GroupName id={group_id} />?</p>
          <button>Si</button>
          <p class='red-text'>Azione non annullabile</p>
        </Match>
        <Match when={verify()!.code === 403}>
          <Show when={'group_setted' in verify()!.extra && 'day_setted' in verify()!.extra}>
            <p>Presenza di <DayOfWeek day={(verify()!.extra.day_setted!)-1} />
            &nbsp;a <GroupName id={verify()!.extra.group_setted!} /> confermata!</p>
          </Show>
        </Match>
        <Match when={'message' in verify()!}>
          <p class='error-box'>{verify()!.message}</p>
        </Match>
      </Switch>
    </Show>
  )
}

export default Attendance
