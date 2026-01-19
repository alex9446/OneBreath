import { createResource, For } from 'solid-js'
import { useSupabase } from '../utils/context'
import Title from '../components/Title'
import FakeButton from '../components/FakeButton'
import GoBack from '../components/GoBack'
import './SportExam.sass'

const SportExam = () => {
  const supabaseClient = useSupabase()

  const sportexamRequestUrl = supabaseClient.storage.from('public-documents')
      .getPublicUrl('Richiesta Vistita Medica v26.pdf')
      .data.publicUrl

  const [contacts] = createResource(async () => {
    const { data: contacts, error } = await supabaseClient.from('sportexam_contacts')
      .select('name,phone_number,notes').order('id')
    if (error) throw error.message
    return contacts
  })

  return (<>
    <Title>Visita sportiva</Title>
    <main id='sportexam-page'>
      <FakeButton href={sportexamRequestUrl}>Scarica modulo</FakeButton>
      <hr />
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
