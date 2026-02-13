import Title from '../components/Title'
import FakeButton from '../components/FakeButton'
import GoBack from '../components/GoBack'

const Payments = () => (<>
  <Title>Pagamenti</Title>
  <main id='payments-page'>
    <FakeButton href='poolpayment'>Conferma pagamento piscina</FakeButton>
    <hr />
    <p><i>Beneficiario:</i> One Breath ASD</p>
    <p><i>IBAN:</i> IT32Q0503414026000000002072</p>
  </main>
  <nav>
    <GoBack />
  </nav>
</>)

export default Payments
