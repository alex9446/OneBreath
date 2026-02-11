import { createResource, For } from 'solid-js'
import { useSupabase } from '../utils/context'
import { contactsByZone } from '../utils/mixed.supabase'
import Title from '../components/Title'
import FakeButtonNative from '../components/FakeButtonNative'
import FakeButton from '../components/FakeButton'
import GoBack from '../components/GoBack'
import './SportExam.sass'

const SportExam = () => {
  const supabaseClient = useSupabase()

  const sportexamRequestUrl = supabaseClient.storage.from('public-documents')
    .getPublicUrl('Richiesta Vistita Medica v26.pdf')
    .data.publicUrl

  const [contacts] = createResource(() => contactsByZone(supabaseClient))

  return (<>
    <Title>Visita sportiva</Title>
    <main id='sportexam-page'>
      <FakeButtonNative href={sportexamRequestUrl} newPage>Scarica modulo</FakeButtonNative>
      <FakeButton href='uploadcertificate'>Carica certificato</FakeButton>
      <For each={contacts()}>
        {(contactsWithZone) => (<>
          <hr />
          <p>Numeri utili in zona {contactsWithZone.zone}</p>
          <For each={contactsWithZone.contacts}>
            {(contact) => (
              <div class='contact'>
                <p>{contact.name}</p>
                <p><a href={`tel:${contact.phone_number}`}>{contact.phone_number}</a></p>
                <p>{contact.notes}</p>
              </div>
            )}
          </For>
        </>)}
      </For>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default SportExam
