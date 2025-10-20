import { Show } from 'solid-js'
import { action, redirect, useSubmission } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import SelectGroup from '../components/SelectGroup'
import Watchword from '../components/Watchword'
import './Register.sass'

const Register = () => {
  const supabaseClient = useSupabase()

  const createUser = action(async (formData: FormData) => {
    const group_id = formData.get('group')!.toString()
    if (group_id === '404') throw 'Group not selected'
    const { error } = await supabaseClient.auth.signUp({
      email: formData.get('email')!.toString(),
      password: formData.get('password')!.toString(),
      options: {data: {
        first_name: formData.get('first-name')!.toString(),
        last_name: formData.get('last-name')!.toString(),
        group_id: group_id,
        watchword: formData.get('watchword')!.toString()
      }}
    })
    if (error) throw error.message
    localStorage.setItem('group_id', group_id)
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
        <Watchword />
        <input type='submit' value='Registrami' />
      </form>
      <Show when={typeof submissions.error === 'string'}>
        <p class='error-box'>{submissions.error}</p>
      </Show>
    </main>
  )
}

export default Register
