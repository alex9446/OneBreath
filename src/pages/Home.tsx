import CheckLogin from '../components/CheckLogin'
import Attendance from '../components/Attendance'
import './Home.sass'

const Home = () => (
  <main id='home-page'>
    <CheckLogin />
    <Attendance />
  </main>
)

export default Home
