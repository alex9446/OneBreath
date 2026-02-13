import { createResource, Show } from 'solid-js'
import { action, useSubmission } from '@solidjs/router'
import { useSupabase } from '../../utils/context'
import { getTodayDate } from '../../utils/mixed'
import { getUserId } from '../../utils/mixed.supabase'
import Title from '../../components/Title'
import ErrorBox from '../../components/ErrorBox'
import GoBack from '../../components/GoBack'
import './UploadCertificate.sass'

const UploadCertificate = () => {
  const supabaseClient = useSupabase()

  const [bucketMetadata] = createResource(async () => {
    const { data, error } = await supabaseClient.storage.getBucket('certificates')
    if (error) throw error.message
    return {
      allowedMimeTypes: data.allowed_mime_types?.join(', ') ?? '',
      fileSizeLimitInMB: (data.file_size_limit ?? 0) / 1000 / 1000
    }
  })

  const uploadAction = action(async (formData: FormData) => {
    const userId = await getUserId(supabaseClient)
    const file = formData.get('file')!
    const date = formData.get('date')!.toString()

    const { data, error: uploadError } = await supabaseClient.storage.from('certificates')
      .upload(userId, file, { upsert: true })
    if (uploadError) throw uploadError.message

    const { error: upsertError } = await supabaseClient.from('certificates')
      .upsert({ object_id: data.id, user_id: userId, expiration: date })
    if (upsertError) throw upsertError.message

    return { ok: true }
  })
  const submission = useSubmission(uploadAction)

  return (<>
    <Title>Carica certificato</Title>
    <main id='uploadcertificate-page'>
      <Show when={submission.result?.ok} fallback={<>
        <p style='text-align: center'>Carica certificato</p>
        <form method='post' action={uploadAction} enctype='multipart/form-data'>
          <input type='file' name='file' accept={bucketMetadata()?.allowedMimeTypes}
                disabled={bucketMetadata.loading} required />
          <p class='size-limit'>
            Dimensione massima {(bucketMetadata()?.fileSizeLimitInMB ?? 0)}MB
          </p>
          <label>
            Data di scadenza:
            <input type='date' name='date' min={getTodayDate()} required />
          </label>
          <input type='submit' value={submission.pending ? 'Invio...' : 'Invia'}
                 disabled={bucketMetadata.loading || submission.pending} />
        </form>
      </>}>
        <p style='color:green'>Certificato inviato con successo!</p>
      </Show>
      <ErrorBox>{submission.error}</ErrorBox>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default UploadCertificate
