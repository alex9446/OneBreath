import { createResource, For } from 'solid-js'
import { useSupabase } from '../utils/context'
import Title from '../components/Title'
import GoBack from '../components/GoBack'
import './Tutorial.sass'

const videoList = [
  {
    title: 'su Firefox (Android)',
    webm: 'Android_Firefox.webm',
    mp4: 'Android_Firefox.mp4'
  },
  {
    title: 'su Chrome (Android)',
    webm: 'Android_Chrome.webm',
    mp4: 'Android_Chrome.mp4'
  },
  {
    title: 'su Safari (iOS 26)',
    webm: 'iOS_Safari.webm',
    mp4: 'iOS_Safari.mp4'
  }
]

const Tutorial = () => {
  const supabaseClient = useSupabase()

  const getSignedUrl = async (filename: string) => {
    const { data, error } = await supabaseClient.storage.from('video-tutorial')
      .createSignedUrl(filename, 900) // 15 minutes
    if (error) throw error.message
    return data.signedUrl
  }

  const [videos] = createResource(() => (
    Promise.all(videoList.map(async (video) => (
      {
        title: video.title,
        webmUrl: (await getSignedUrl(video.webm)),
        mp4Url: (await getSignedUrl(video.mp4))
      }
    )))
  ))

  return (<>
    <Title>Video tutorial</Title>
    <main id='tutorial-page'>
      <p>Installazione Web App e attivazione notifiche 🔔</p>
      <For each={videos()}>
        {(video) => (
          <article>
            <h5>{video.title}</h5>
            <video controls preload='metadata' style={{ 'max-height': '80svh' }}>
              <source type='video/webm' src={video.webmUrl} />
              <source type='video/mp4' src={video.mp4Url} />
            </video>
          </article>
        )}
      </For>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default Tutorial
