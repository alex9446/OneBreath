import { Show } from 'solid-js'
import { getAdminInLS } from '../utils/mixed'
import Title from '../components/Title'
import AthleteStatus from '../components/AthleteStatus'
import Attendance from '../components/Attendance'
import FakeButton from '../components/FakeButton'

const Home = () => (<>
  <Title>Homepage</Title>
  <main id='home-page'>
    <AthleteStatus />
    <Attendance />
  </main>
  <nav>
    <Show when={getAdminInLS() >= 1}>
      <FakeButton color='gold' href='/staff'>Area staff</FakeButton>
    </Show>
    <FakeButton href='/menu'>Menu</FakeButton>
  </nav>
</>)

export default Home
