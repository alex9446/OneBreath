import { lazy } from 'solid-js'
import FakeButton from '../components/FakeButton'
import './Home.sass'
const Attendance = lazy(() => import('../components/Attendance'))

const Home = () => (
  <main id='home-page'>
    <Attendance />
    <FakeButton href='/settings'>Impostazioni</FakeButton>
    <FakeButton href='/leaderboard'>Classifica presenze</FakeButton>
  </main>
)

export default Home
