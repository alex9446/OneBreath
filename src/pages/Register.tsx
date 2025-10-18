import { createResource, For, Suspense } from 'solid-js'
import { action, redirect, useSubmission } from '@solidjs/router'
import { useSupabase } from '../context'
import './Register.sass'

const Register = () => {
  const supabaseClient = useSupabase()!

  const fetchGroups = async () => {
    const { data: groups, error } = await supabaseClient.from('groups').select('id,name').order('id')
    if (error) throw error.message
    return groups
  }
  const [groups] = createResource(fetchGroups)

  const createUser = action(async (formData: FormData) => {
    const { error } = await supabaseClient.auth.signUp({
      email: formData.get('email')!.toString(),
      password: formData.get('password')!.toString(),
      options: {data: {
        first_name: formData.get('first-name')!.toString(),
        last_name: formData.get('last-name')!.toString(),
        group_id: formData.get('group')!.toString(),
        watchword: formData.get('watchword')!.toString()
      }}
    })
    if (error) throw error.message
    throw redirect('/')
  })
  const submissions = useSubmission(createUser)

  return (
    <main id='register-page'>
      <form method='post' action={createUser}>
        <input type='email' name='email' required placeholder='email' />
        <input type='password' name='password' required minLength="6" placeholder='password' />
        <input type='text' name='first-name' required placeholder='nome' />
        <input type='text' name='last-name' required placeholder='cognome' />
        <select name='group'>
          <Suspense fallback={<option>Caricamento gruppi...</option>}>
            <For each={groups()}>
              {(group) => <option value={group.id}>{group.name}</option>}
            </For>
          </Suspense>
        </select>
        <label for='watchword'>Parola d'ordine:</label>
        <input id='watchword' type='text' name='watchword' required />
        <input type='submit' value='Registrami' disabled={groups.state !== 'ready'} />
      </form>
      <p class='error-box'>
        {typeof submissions.error === 'string' && submissions.error}
      </p>
    </main>
  )
}

export default Register
