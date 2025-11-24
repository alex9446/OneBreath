import { A, action, redirect, useSubmission } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import { fillLocalStorage } from '../utils/mixed.supabase'
import Title from '../components/Title'
import ErrorBox from '../components/ErrorBox'
import OrLine from '../components/OrLine'
import FakeButton from '../components/FakeButton'
import './Login.sass'

const Login = () => {
  const supabaseClient = useSupabase()

  const logonUser = action(async (formData: FormData) => {
    const { data: auth, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: formData.get('email')!.toString(),
      password: formData.get('password')!.toString()
    })
    if (signInError) throw signInError.message
    await fillLocalStorage(supabaseClient, auth.user.id)
    throw redirect('/')
  })
  const submission = useSubmission(logonUser)

  return (<>
    <Title>Login</Title>
    <main id='login-page'>
      <form method='post' action={logonUser}>
        <input type='email' name='email' required placeholder='email' />
        <input type='password' name='password' required placeholder='password'
               minLength='6' autocomplete='current-password' />
        <A class='fp' href='forgottenpassword'>Password dimenticata?</A>
        <input type='submit' value='Login' disabled={submission.pending} />
      </form>
      <ErrorBox>{submission.error}</ErrorBox>
      <OrLine />
      <FakeButton href='/register'>Crea account</FakeButton>
    </main>
  </>)
}

export default Login
