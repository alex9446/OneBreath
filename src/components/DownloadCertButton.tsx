import { createResource, type Component } from 'solid-js'
import { useSupabase } from '../utils/context'
import { getCertificateUrl } from '../utils/mixed.supabase'
import FakeButtonNative from './FakeButtonNative'

const DownloadCertButton: Component<{ userId: string | Promise<string> }> = (props) => {
  const supabaseClient = useSupabase()
  const [certificateUrl] = createResource(async () => (
    getCertificateUrl(supabaseClient, await props.userId, 'certificato')
  ))

  return (
    <FakeButtonNative href={certificateUrl()} newPage disabled={!certificateUrl()}>
      Scarica certificato
    </FakeButtonNative>
  )
}

export default DownloadCertButton
