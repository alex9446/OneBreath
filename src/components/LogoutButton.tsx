import { action, redirect, useAction, useSubmission } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import ErrorBox from './ErrorBox'

const LogoutButton = () => {
  const supabaseClient = useSupabase()

  const logout = action(async () => {
    const { error } = await supabaseClient.auth.signOut()
    if (error) throw error.message
    throw redirect('/login')
  })
  const useLogout = useAction(logout)
  const submission = useSubmission(logout)
  const onClickEvent = () => {
    submission.clear() // workaround to remove the last submission error
    useLogout()
  }

  return (<>
    <button onClick={onClickEvent} disabled={submission.pending}
            style='background-color: #b62324'>Logout</button>
    <ErrorBox>{submission.error}</ErrorBox>
  </>)
}

export default LogoutButton
