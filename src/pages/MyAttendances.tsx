import UserAttendances from '../components/UserAttendances'
import GoBack from '../components/GoBack'

const MyAttendances = () => (<>
  <main id='myattendances-page' style='align-items: center'>
    <p style='text-align: center'>Le mie presenze</p>
    <UserAttendances />
  </main>
  <nav>
    <GoBack />
  </nav>
</>)

export default MyAttendances
