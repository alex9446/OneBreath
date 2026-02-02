import { createResource, For } from 'solid-js'
import { useSupabase } from '../utils/context'
import Title from '../components/Title'
import GoBack from '../components/GoBack'

const videoList = [
  {
    title: 'Firefox - Android:',
    filenames: ['Android_Firefox.webm', 'Android_Firefox.mp4']
  },
  {
    title: 'Chrome - Android:',
    filenames: ['Android_Chrome.webm', 'Android_Chrome.mp4']
  },
  {
    title: 'Safari - iOS 26:',
    filenames: ['iOS_Safari.webm', 'iOS_Safari.mp4']
  }
]

const Tutorial = () => {
  const supabaseClient = useSupabase()

  const [videos] = createResource(() => (
    Promise.all(videoList.map(async (video) => {
      const { data, error } = await supabaseClient.storage.from('video-tutorial')
        .createSignedUrls(video.filenames, 900) // 15 minutes
      if (error) throw error.message
      return { title: video.title, data }
    }))
  ))

  return (<>
    <Title>Video tutorial</Title>
    <main id='tutorial-page'>
      <For each={videos()}>
        {(video) => (
          <div>
            <p>{video.title}</p>
            <video controls preload='metadata' style={{ 'max-height': '80svh' }}>
              <source type='video/webm' src={video.data[0].signedUrl} />
              <source type='video/mp4' src={video.data[1].signedUrl} />
            </video>
          </div>
        )}
      </For>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default Tutorial
