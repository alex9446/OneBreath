import { createResource, For, Suspense } from 'solid-js'
import { useSupabase } from '../../utils/context'
import { getCertificateUrl } from '../../utils/mixed.supabase'
import Title from '../../components/Title'
import GoBack from '../../components/GoBack'
import './Certificates.sass'

const Certificates = () => {
  const supabaseClient = useSupabase()

  const [uploadedCertificates] = createResource(async () => {
    const profiles = await supabaseClient.from('profiles').select('id,first_name,last_name')
    if (profiles.error) throw profiles.error.message
    const namesById = new Map(profiles.data.map((profile) => (
      [profile.id, `${profile.first_name} ${profile.last_name}`]
    )))

    const { data: certificates, error } = await supabaseClient.from('certificates')
      .select('user_id,expiration')
    if (error) throw error.message
    return Promise.all(certificates.map(async (certificate) => {
      const athleteName = namesById.get(certificate.user_id)
      const filename = `${athleteName}, Scad. ${certificate.expiration}`
      return {
        ...certificate,
        athleteName,
        certificateUrl: await getCertificateUrl(supabaseClient, certificate.user_id, filename)
      }
    }))
  })

  return (<>
    <Title>Certificati caricati</Title>
    <main id='certificates-page'>
      <Suspense fallback='Caricamento...'>
          <For each={uploadedCertificates()}>
            {(certificate) => (
              <article>
                <section>
                  <p>{certificate.athleteName}</p>
                  <p>{certificate.expiration}</p>
                </section>
                <section>
                  <a href={certificate.certificateUrl} target='_blank'>Download</a>
                </section>
              </article>
            )}
          </For>
      </Suspense>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default Certificates
