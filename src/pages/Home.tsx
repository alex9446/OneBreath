import { lazy } from 'solid-js'
import RequireLogin from '../components/RequireLogin'
import FakeButton from '../components/FakeButton'
import './Home.sass'
const Attendance = lazy(() => import('../components/Attendance'))

const Home = () => (
  <main id='home-page'>
    <RequireLogin>
      <Attendance />
    </RequireLogin>
    <FakeButton href='/settings'>Impostazioni</FakeButton>
  </main>
)

export default Home
