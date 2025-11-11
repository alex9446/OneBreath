import { action, redirect, useSubmission } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import { setGroupInLS } from '../utils/mixed'
import ErrorBox from '../components/ErrorBox'
import OrLine from '../components/OrLine'
import FakeButton from '../components/FakeButton'

const Login = () => {
  const supabaseClient = useSupabase()

  const logonUser = action(async (formData: FormData) => {
    const { data: auth, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: formData.get('email')!.toString(),
      password: formData.get('password')!.toString()
    })
    if (signInError) throw signInError.message
    const { data: profile, error: profilesError } = await supabaseClient.from('profiles')
      .select('group_id').eq('id', auth.user.id).single()
    if (profilesError) throw profilesError.message
    setGroupInLS(profile.group_id)
    throw redirect('/')
  })
  const submission = useSubmission(logonUser)

  return (
    <main id='login-page'>
      <form method='post' action={logonUser}>
        <input type='email' name='email' required placeholder='email' />
        <input type='password' name='password' required minLength='6' placeholder='password' />
        <input type='submit' value='Login' disabled={submission.pending} />
      </form>
      <ErrorBox>{submission.error}</ErrorBox>
      <OrLine />
      <FakeButton href='/register'>Crea account</FakeButton>
    </main>
  )
}

export default Login
