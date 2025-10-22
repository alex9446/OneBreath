import { Show } from 'solid-js'
import { action, redirect, useNavigate, useSubmission } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import { setGroupInLS } from '../utils/mixed'
import OrLine from '../components/OrLine'
import './Login.sass'

const Login = () => {
  const navigate = useNavigate()
  const supabaseClient = useSupabase()

  const logonUser = action(async (formData: FormData) => {
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: formData.get('email')!.toString(),
      password: formData.get('password')!.toString()
    })
    if (signInError) throw signInError.message
    const { data: profiles, error: profilesError } = await supabaseClient.from('profiles').select('group_id')
    if (profilesError) throw profilesError.message
    if (profiles.length !== 1) throw 'Mismatch with profile select'
    setGroupInLS(profiles[0].group_id)
    throw redirect('/')
  })
  const submissions = useSubmission(logonUser)

  return (
    <main id='login-page'>
      <form method='post' action={logonUser}>
        <input type='email' name='email' required placeholder='email' />
        <input type='password' name='password' required minLength='6' placeholder='password' />
        <input type='submit' value='Login' />
      </form>
      <Show when={typeof submissions.error === 'string'}>
        <p class='error-box'>{submissions.error}</p>
      </Show>
      <OrLine />
      <button onClick={() => navigate('/register')}>Crea account</button>
    </main>
  )
}

export default Login
