import { createResource, For } from 'solid-js'
import { useSupabase } from '../utils/context'
import Title from '../components/Title'
import GoBack from '../components/GoBack'
import './SportExam.sass'

const SportExam = () => {
  const supabaseClient = useSupabase()

  const [contacts] = createResource(async () => {
    const { data: contacts, error } = await supabaseClient.from('sportexam_contacts')
      .select('name,phone_number,notes').order('id')
    if (error) throw error.message
    return contacts
  })

  return (<>
    <Title>Visita sportiva</Title>
    <main id='sportexam-page'>
      <p style='text-align: center'>Numeri utili</p>
      <For each={contacts()}>
        {(contact) => (
          <div class='contact'>
            <p>{contact.name}</p>
            <p><a href={`tel:${contact.phone_number}`}>{contact.phone_number}</a></p>
            <p>{contact.notes}</p>
          </div>
        )}
      </For>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default SportExam
