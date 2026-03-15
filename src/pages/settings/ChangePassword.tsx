import { createSignal, Show } from 'solid-js'
import { action, useLocation, useSubmission } from '@solidjs/router'
import { useSupabase } from '../../utils/context'
import { fillLocalStorage, getUserId } from '../../utils/mixed.supabase'
import { FormManager } from '../../utils/mixed'
import manageRawError from '../../utils/manageRawError'
import Title from '../../components/Title'
import ErrorBox from '../../components/ErrorBox'
import GoBack from '../../components/GoBack'

const ChangePassword = () => {
  const location = useLocation()
  const supabaseClient = useSupabase()
  const [success, setSuccess] = createSignal(false)

  if (location.search.includes('reset')) {
    getUserId(supabaseClient)
      .then((userId) => fillLocalStorage(supabaseClient, userId))
      .catch((error) => console.error(manageRawError(error)))
  }

  const setNewPassword = action(async (formData: FormData) => {
    const formManager = new FormManager(formData)
    const { error } = await supabaseClient.auth.updateUser({
      password: formManager.getString('password')
    })
    if (error) throw error.message
    setSuccess(true)
  })
  const submission = useSubmission(setNewPassword)

  return (<>
    <Title>Impostazioni &gt; Cambia password</Title>
    <main id='changepassword-page'>
      <Show when={!success()} fallback={<p style='color:green'>Password modificata con successo!</p>}>
        <form method='post' action={setNewPassword}>
          <input type='password' name='password' required placeholder='nuova password'
                 minLength='6' autocomplete='new-password' />
          <input type='submit' value='Conferma' disabled={submission.pending} />
        </form>
        <ErrorBox>{submission.error}</ErrorBox>
      </Show>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default ChangePassword
