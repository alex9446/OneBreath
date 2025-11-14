import { action, redirect, useSubmission } from '@solidjs/router'
import type { SupabaseClientDB } from '../utils/shortcut.types'
import { setAdminInLS, setGroupInLS } from '../utils/mixed'
import { useSupabase } from '../utils/context'
import ErrorBox from '../components/ErrorBox'
import OrLine from '../components/OrLine'
import FakeButton from '../components/FakeButton'

const fillLocalStorage = async (supabaseClient: SupabaseClientDB, userId: string) => {
  const { data: profile, error: profileError } = await supabaseClient.from('profiles')
    .select('group_id').eq('id', userId).single()
  if (profileError) throw profileError.message
  setGroupInLS(profile.group_id)

  const { data: admin, error: adminError } = await supabaseClient.from('admins')
    .select('level').eq('id', userId).maybeSingle()
  if (adminError) throw adminError.message
  setAdminInLS(admin ? admin.level : 0)
}

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
