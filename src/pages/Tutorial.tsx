import { useSupabase } from '../utils/context'
import Title from '../components/Title'
import GoBack from '../components/GoBack'

const Tutorial = () => {
  const supabaseClient = useSupabase()

  const getPublicUrl = (filename: string) => (
    supabaseClient.storage.from('public-documents').getPublicUrl(filename).data.publicUrl
  )

  const videoUrls = {
    androidChromeWebm: getPublicUrl('Android Chrome.webm'),
    androidChromeMp4: getPublicUrl('Android Chrome.mp4'),
    iosSafariWebm: getPublicUrl('iOS Safari.webm'),
    iosSafariMp4: getPublicUrl('iOS Safari.mp4')
  }

  return (<>
    <Title>Video tutorial</Title>
    <main id='tutorial-page'>
      <p>Chrome - Android:</p>
      <video controls>
        <source type='video/webm' src={videoUrls.androidChromeWebm} />
        <source type='video/mp4' src={videoUrls.androidChromeMp4} />
      </video>
      <p>Safari - iOS:</p>
      <video controls>
        <source type='video/webm' src={videoUrls.iosSafariWebm} />
        <source type='video/mp4' src={videoUrls.iosSafariMp4} />
      </video>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default Tutorial
