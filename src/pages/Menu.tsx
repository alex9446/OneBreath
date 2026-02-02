import Title from '../components/Title'
import FakeButton from '../components/FakeButton'
import FakeButtonNative from '../components/FakeButtonNative'
import LogoutButton from '../components/LogoutButton'
import GoBack from '../components/GoBack'

const Menu = () => (<>
  <Title>Menu</Title>
  <main id='menu-page'>
    <FakeButton href='/settings'>Impostazioni</FakeButton>
    <FakeButton href='/leaderboard'>Classifica presenze</FakeButton>
    <FakeButton href='/myattendances'>Le mie presenze</FakeButton>
    <FakeButton href='/tutorial'>Video tutorial</FakeButton>
    <FakeButton href='/sportexam'>Visita sportiva</FakeButton>
    <FakeButtonNative href='https://www.onebreath.it/informativa-protezione-dati/' newPage>
      Informativa protezione dati
    </FakeButtonNative>
  </main>
  <nav>
    <LogoutButton />
    <GoBack />
  </nav>
</>)

export default Menu
