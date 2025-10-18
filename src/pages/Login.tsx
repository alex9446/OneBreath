import { action, redirect, useNavigate, useSubmission } from '@solidjs/router'
import { useSupabase } from '../context'
import './Login.sass'

const Login = () => {
  const navigate = useNavigate()
  const supabaseClient = useSupabase()!

  const logonUser = action(async (formData: FormData) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: formData.get('email')!.toString(),
      password: formData.get('password')!.toString()
    })
    if (error) throw error.message
    throw redirect('/')
  })
  const submissions = useSubmission(logonUser)

  return(
    <main id='login-page'>
      <form method='post' action={logonUser}>
        <input type='email' name='email' required placeholder='email' />
        <input type='password' name='password' required minLength="6" placeholder='password' />
        <input type='submit' value='Login' />
      </form>
      <p class='error-box'>
        {typeof submissions.error === 'string' && submissions.error}
      </p>
      <p class='line'>oppure</p>
      <button onClick={() => navigate('/register')}>Crea account</button>
    </main>
  )
}

export default Login
