import { lazy } from 'solid-js'
import FakeButton from '../components/FakeButton'
const Attendance = lazy(() => import('../components/Attendance'))

const Home = () => (<>
  <main id='home-page'>
    <Attendance />
  </main>
  <footer>
    <FakeButton href='/settings'>Impostazioni</FakeButton>
    <FakeButton href='/leaderboard'>Classifica presenze</FakeButton>
    <FakeButton href='/myattendances'>Le mie presenze</FakeButton>
  </footer>
</>)

export default Home
