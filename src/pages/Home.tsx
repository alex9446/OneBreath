import { Show } from 'solid-js'
import { getAdminInLS } from '../utils/mixed'
import Attendance from '../components/Attendance'
import FakeButton from '../components/FakeButton'

const Home = () => (<>
  <main id='home-page'>
    <Attendance />
  </main>
  <nav>
    <Show when={getAdminInLS() >= 1}>
      <FakeButton color='darkorange' href='/staff'>Accesso staff</FakeButton>
    </Show>
    <FakeButton href='/settings'>Impostazioni</FakeButton>
    <FakeButton href='/leaderboard'>Classifica presenze</FakeButton>
    <FakeButton href='/myattendances'>Le mie presenze</FakeButton>
  </nav>
</>)

export default Home
