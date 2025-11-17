import UserAttendances from '../components/UserAttendances'
import FakeButton from '../components/FakeButton'

const MyAttendances = () => (<>
  <main id='myattendances-page' style='align-items: center'>
    <p style='text-align: center'>Le mie presenze</p>
    <UserAttendances />
  </main>
  <footer>
    <FakeButton href='/'>Torna indietro</FakeButton>
  </footer>
</>)

export default MyAttendances
