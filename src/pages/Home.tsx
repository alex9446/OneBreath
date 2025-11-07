import { lazy } from 'solid-js'
import OrLine from '../components/OrLine'
import FakeButton from '../components/FakeButton'
import './Home.sass'
const Attendance = lazy(() => import('../components/Attendance'))

const Home = () => (
  <main id='home-page'>
    <Attendance />
    <OrLine />
    <FakeButton href='/settings'>Impostazioni</FakeButton>
    <FakeButton href='/leaderboard'>Classifica presenze</FakeButton>
    <FakeButton href='/myattendances'>Le mie presenze</FakeButton>
  </main>
)

export default Home
