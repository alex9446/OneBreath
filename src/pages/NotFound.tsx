import Title from '../components/Title'
import FakeButton from '../components/FakeButton'

const NotFound = () => (<>
  <Title>Pagina non trovata</Title>
  <main id='notfound-page'>
    <p>Pagina non trovata</p>
  </main>
  <nav>
    <FakeButton href='/'>Torna alla homepage</FakeButton>
  </nav>
</>)

export default NotFound
