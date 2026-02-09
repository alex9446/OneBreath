import { createResource } from 'solid-js'
import { action } from '@solidjs/router'
import { useSupabase } from '../../utils/context'
import { getUserId } from '../../utils/mixed.supabase'
import Title from '../../components/Title'
import GoBack from '../../components/GoBack'
import './UploadCertificate.sass'

const UploadCertificate = () => {
  const supabaseClient = useSupabase()
  const todayDate = new Date().toLocaleDateString('en-CA')  // en-CA because by default it formats dates as yyyy-mm-dd

  const [allowedMimeTypes] = createResource(async () => {
    const { data, error } = await supabaseClient.storage.getBucket('test-upload')
    if (error) throw error.message
    return data.allowed_mime_types?.join(', ') ?? ''
  })

  const uploadAction = action(async (formData: FormData) => {
    const userId = await getUserId(supabaseClient)
    const file = formData.get('file')!

    const { data, error } = await supabaseClient.storage.from('test-upload')
      .upload(userId, file, { upsert: true })
    if (error) throw error.message
    return data.id
  })

  return (<>
    <Title>Carica certificato</Title>
    <main id='uploadcertificate-page'>
      <form method='post' action={uploadAction} enctype='multipart/form-data'>
        <input type='file' name='file' accept={allowedMimeTypes()}
               disabled={allowedMimeTypes.loading} required />
        <label for='expiration-date'>Data di scadenza:</label>
        <input id='expiration-date' type='date' name='date' min={todayDate} required />
        <input type='submit' value='Invia' disabled={allowedMimeTypes.loading} />
      </form>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default UploadCertificate
