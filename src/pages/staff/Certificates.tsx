import { createResource, createSignal, For, Suspense } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import type { Tables } from '../../utils/database.types'
import { useSupabase } from '../../utils/context'
import { downloadCertificate } from '../../utils/mixed.supabase'
import { getDateLocaleIT } from '../../utils/mixed'
import { mdiTrayArrowDown } from '../../utils/iconPaths'
import Title from '../../components/Title'
import ErrorBox from '../../components/ErrorBox'
import Icon from '../../components/Icon'
import GoBack from '../../components/GoBack'
import './Certificates.sass'

type Certificate = Pick<Tables<'certificates'>, 'user_id' | 'expiration'> & {
  athleteName: string | undefined
}

const Certificates = () => {
  const supabaseClient = useSupabase()
  const [itemsBeingDownloaded, setItemsBeingDownloaded] = createSignal<number[]>([])

  const [uploadedCertificates] = createResource(async () => {
    const profiles = await supabaseClient.from('profiles').select('id,first_name,last_name')
    if (profiles.error) throw profiles.error.message
    const namesById = new Map(profiles.data.map((profile) => (
      [profile.id, `${profile.first_name} ${profile.last_name}`]
    )))

    const { data: certificates, error } = await supabaseClient.from('certificates')
      .select('user_id,expiration')
    if (error) throw error.message
    return certificates.map((certificate): Certificate => ({
      ...certificate,
      athleteName: namesById.get(certificate.user_id)
    }))
  })

  const handleDownload = action(async (certificate: Certificate, itemClicked: number) => {
    setItemsBeingDownloaded((prev) => [...prev, itemClicked])
    const downloadName = `${certificate.athleteName} - Scadenza ${certificate.expiration}`
    try {
      await downloadCertificate(supabaseClient, certificate.user_id, downloadName)
    } finally {
      setItemsBeingDownloaded((prev) => prev.filter((item) => item !== itemClicked))
    }
    return { ok: true }
  })
  const useHandler = useAction(handleDownload)
  const submission = useSubmission(handleDownload)

  return (<>
    <Title>Certificati caricati</Title>
    <main id='certificates-page'>
      <ErrorBox>{submission.error}</ErrorBox>
      <div class='grid'>
        <Suspense fallback='Caricamento...'>
            <For each={uploadedCertificates()}>
              {(certificate, index) => (
                <article onClick={() => useHandler(certificate, index())}>
                  <section>
                    <h5>{certificate.athleteName}</h5>
                    <p>{getDateLocaleIT(certificate.expiration)}</p>
                  </section>
                  <section>
                    <Icon path={mdiTrayArrowDown} title='download'
                          classList={{ pending: itemsBeingDownloaded().includes(index()) }} />
                  </section>
                </article>
              )}
            </For>
        </Suspense>
      </div>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default Certificates
