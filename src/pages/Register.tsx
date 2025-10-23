import { createSignal, Show } from 'solid-js'
import { action, redirect, useNavigate, useSubmission } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import { setGroupInLS } from '../utils/mixed'
import SelectGroup from '../components/SelectGroup'
import Watchword from '../components/Watchword'
import OrLine from '../components/OrLine'

const Register = () => {
  const [watchwordValid, setWatchwordValid] = createSignal(false)
  const navigate = useNavigate()
  const supabaseClient = useSupabase()

  const createUser = action(async (formData: FormData) => {
    if (!watchwordValid()) throw 'Parola d\'ordine non valida'
    const groupId = formData.get('group')!.toString()
    if (groupId === '404') throw 'Group not selected'
    const { error } = await supabaseClient.auth.signUp({
      email: formData.get('email')!.toString(),
      password: formData.get('password')!.toString(),
      options: {data: {
        first_name: formData.get('first-name')!.toString(),
        last_name: formData.get('last-name')!.toString(),
        group_id: groupId,
        watchword: formData.get('watchword')!.toString()
      }}
    })
    if (error) throw error.message
    setGroupInLS(groupId)
    throw redirect('/')
  })
  const submissions = useSubmission(createUser)

  return (
    <main id='register-page'>
      <form method='post' action={createUser}>
        <input type='email' name='email' required placeholder='email' />
        <input type='password' name='password' required minLength='6' placeholder='password' />
        <input type='text' name='first-name' required placeholder='nome' />
        <input type='text' name='last-name' required placeholder='cognome' />
        <SelectGroup />
        <Watchword valid={watchwordValid} setValid={setWatchwordValid} />
        <input type='submit' value='Crea account' />
      </form>
      <Show when={typeof submissions.error === 'string'}>
        <p class='error-box'>{submissions.error}</p>
      </Show>
      <OrLine />
      <button onClick={() => navigate('/login')}>Login</button>
    </main>
  )
}

export default Register
