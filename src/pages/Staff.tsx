import FakeButton from '../components/FakeButton'
import GoBack from '../components/GoBack'

const Staff = () => (<>
  <main id='staff-page'>
    <FakeButton href='athletes'>Lista atleti</FakeButton>
    <FakeButton href='attendances'>Storico presenze</FakeButton>
  </main>
  <nav>
    <GoBack />
  </nav>
</>)

export default Staff
