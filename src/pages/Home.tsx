import { Show } from 'solid-js'
import { getAdminInLS } from '../utils/mixed'
import Title from '../components/Title'
import Attendance from '../components/Attendance'
import FakeButton from '../components/FakeButton'

const Home = () => (<>
  <Title>Homepage</Title>
  <main id='home-page'>
    <Attendance />
  </main>
  <nav>
    <Show when={getAdminInLS() >= 1}>
      <FakeButton color='darkorange' href='/staff'>Area staff</FakeButton>
    </Show>
    <FakeButton href='/settings'>Impostazioni</FakeButton>
    <FakeButton href='/leaderboard'>Classifica presenze</FakeButton>
    <FakeButton href='/myattendances'>Le mie presenze</FakeButton>
  </nav>
</>)

export default Home
