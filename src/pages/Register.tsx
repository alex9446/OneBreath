import { createSignal } from 'solid-js'
import { action, redirect, useSubmission } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import { setGroupInLS } from '../utils/mixed'
import RadioGroup from '../components/RadioGroup'
import Watchword from '../components/Watchword'
import ErrorBox from '../components/ErrorBox'
import OrLine from '../components/OrLine'
import FakeButton from '../components/FakeButton'

const Register = () => {
  const [watchwordValid, setWatchwordValid] = createSignal(false)
  const supabaseClient = useSupabase()

  const createUser = action(async (formData: FormData) => {
    if (!watchwordValid()) throw 'Parola d\'ordine non valida'
    const groupId = formData.get('group')!.toString()
    if (groupId === '0') throw 'Group not selected'
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
        <RadioGroup />
        <Watchword valid={watchwordValid} setValid={setWatchwordValid} />
        <input type='submit' value='Crea account' disabled={submissions.pending} />
      </form>
      <ErrorBox>{submissions.error}</ErrorBox>
      <OrLine />
      <FakeButton href='/login'>Login</FakeButton>
    </main>
  )
}

export default Register
