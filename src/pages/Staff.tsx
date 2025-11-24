import Title from '../components/Title'
import FakeButton from '../components/FakeButton'
import GoBack from '../components/GoBack'

const Staff = () => (<>
  <Title>Area staff</Title>
  <main id='staff-page'>
    <FakeButton href='athletes'>Lista atleti</FakeButton>
    <FakeButton href='attendances'>Storico presenze</FakeButton>
  </main>
  <nav>
    <GoBack />
  </nav>
</>)

export default Staff
