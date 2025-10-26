import RequireLogin from '../components/RequireLogin'
import Attendance from '../components/Attendance'
import './Home.sass'

const Home = () => (
  <main id='home-page'>
    <RequireLogin>
      <Attendance />
    </RequireLogin>
  </main>
)

export default Home
