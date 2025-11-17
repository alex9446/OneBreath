import UserAttendances from '../components/UserAttendances'
import GoBack from '../components/GoBack'

const MyAttendances = () => (<>
  <main id='myattendances-page' style='align-items: center'>
    <p style='text-align: center'>Le mie presenze</p>
    <UserAttendances />
  </main>
  <footer>
    <GoBack />
  </footer>
</>)

export default MyAttendances
