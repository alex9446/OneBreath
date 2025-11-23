import { createSignal, Show } from 'solid-js'
import { action, useSubmission } from '@solidjs/router'
import { useSupabase } from '../../utils/context'
import ErrorBox from '../../components/ErrorBox'
import GoBack from '../../components/GoBack'

const ForgottenPassword = () => {
  const supabaseClient = useSupabase()
  const [success, setSuccess] = createSignal(false)

  const sendReset = action(async (formData: FormData) => {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      formData.get('email')!.toString(),
      { redirectTo: `${window.location.origin}/settings/changepassword?reset` }
    )
    if (error) throw error.message
    setSuccess(true)
  })
  const submission = useSubmission(sendReset)

  return (<>
    <main id='forgottenpassword-page'>
      <Show when={!success()} fallback={<p style='color:green'>Mail di reset inviata!</p>}>
        <form method='post' action={sendReset}>
          <input type='email' name='email' required placeholder='email' />
          <input type='submit' value='Invia mail di reset' disabled={submission.pending} />
        </form>
        <ErrorBox>{submission.error}</ErrorBox>
      </Show>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default ForgottenPassword
