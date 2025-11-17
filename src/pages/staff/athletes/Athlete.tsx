import { useParams } from '@solidjs/router'
import UserAttendances from '../../../components/UserAttendances'
import GoBack from '../../../components/GoBack'

const Athlete = () => {
  const userId = useParams().id

  return (<>
    <main id='athlete-page' style='align-items: center'>
      <UserAttendances id={userId} />
    </main>
    <footer>
      <GoBack />
    </footer>
  </>)
}

export default Athlete
