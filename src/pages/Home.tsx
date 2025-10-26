import RequireLogin from '../components/RequireLogin'
import Attendance from '../components/Attendance'
import FakeButton from '../components/FakeButton'
import './Home.sass'

const Home = () => (
  <main id='home-page'>
    <RequireLogin>
      <Attendance />
    </RequireLogin>
    <FakeButton href='/settings'>Impostazioni</FakeButton>
  </main>
)

export default Home
