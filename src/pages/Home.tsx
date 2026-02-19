import { Show } from 'solid-js'
import { A } from '@solidjs/router'
import { getAdminInLS } from '../utils/mixed'
import Title from '../components/Title'
import AthleteStatus from '../components/AthleteStatus'
import Attendance from '../components/Attendance'
import FakeButton from '../components/FakeButton'
import './Home.sass'

const Home = () => (<>
  <Title>Homepage</Title>
  <main id='home-page'>
    <AthleteStatus />
    <Attendance />
  </main>
  <nav>
    <p class='new-stuff'>
      <span>Novità:</span> <A href='/tutorial'>video tutorial</A> per attivazione notifiche!
    </p>
    <Show when={getAdminInLS() >= 1}>
      <FakeButton color='gold' href='/staff'>Area staff</FakeButton>
    </Show>
    <FakeButton href='/menu'>Menu</FakeButton>
  </nav>
</>)

export default Home
