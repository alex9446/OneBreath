import { createResource, type Component } from 'solid-js'
import { useSupabase } from '../utils/context'
import FakeButtonNative from './FakeButtonNative'

const DownloadCertButton: Component<{ userId: string | Promise<string> }> = (props) => {
  const supabaseClient = useSupabase()

  const [certificateUrl] = createResource(async () => {
    const { data } = await supabaseClient.storage.from('certificates')
      .createSignedUrl(await props.userId, 900, { download: 'certificato' }) // 15 minutes
    return data?.signedUrl
  })

  return (
    <FakeButtonNative href={certificateUrl()} newPage disabled={!certificateUrl()}>
      Scarica certificato
    </FakeButtonNative>
  )
}

export default DownloadCertButton
