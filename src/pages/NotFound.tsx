import FakeButton from '../components/FakeButton'

const NotFound = () => (<>
  <main id='notfound-page'>
    <p>Pagina non trovata</p>
  </main>
  <footer>
    <FakeButton href='/'>Torna alla homepage</FakeButton>
  </footer>
</>)

export default NotFound
