import { createSignal } from 'solid-js'
import { action, redirect, useSubmission } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import { capwords, FormManager, setGroupInLS } from '../utils/mixed'
import Title from '../components/Title'
import RadioGroup from '../components/RadioGroup'
import Watchword from '../components/Watchword'
import ErrorBox from '../components/ErrorBox'
import OrLine from '../components/OrLine'
import FakeButton from '../components/FakeButton'

const Register = () => {
  const [watchwordValid, setWatchwordValid] = createSignal(false)
  const supabaseClient = useSupabase()

  const createUser = action(async (formData: FormData) => {
    const formManager = new FormManager(formData)
    if (!watchwordValid()) throw 'Parola d\'ordine non valida'
    const groupId = formManager.getString('group')
    const firstName = capwords(formManager.getString('first-name').trim())
    const lastName = capwords(formManager.getString('last-name').trim())
    if (groupId === '0') throw 'Gruppo non selezionato'
    if (!firstName || !lastName) throw 'Nome e/o cognome assenti'

    const { error } = await supabaseClient.auth.signUp({
      email: formManager.getString('email'),
      password: formManager.getString('password'),
      options: {data: {
        first_name: firstName,
        last_name: lastName,
        group_id: groupId,
        watchword: formManager.getString('watchword')
      }}
    })
    if (error) throw error.message
    setGroupInLS(groupId)
    throw redirect('/')
  })
  const submission = useSubmission(createUser)

  return (<>
    <Title>Crea account</Title>
    <main id='register-page'>
      <form method='post' action={createUser}>
        <input type='email' name='email' required placeholder='email' />
        <input type='password' name='password' required placeholder='password'
               minLength='6' autocomplete='new-password' />
        <input type='text' name='first-name' required placeholder='nome' />
        <input type='text' name='last-name' required placeholder='cognome' />
        <RadioGroup />
        <Watchword valid={watchwordValid} setValid={setWatchwordValid} />
        <input type='submit' value='Crea account' disabled={submission.pending} />
      </form>
      <ErrorBox>{submission.error}</ErrorBox>
      <OrLine />
      <FakeButton href='/login'>Login</FakeButton>
    </main>
  </>)
}

export default Register
