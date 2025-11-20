import { Show } from 'solid-js'
import './DomainChangeAlert.sass'

const DomainChangeAlert = () => (
  <Show when={window.location.origin !== 'https://soci.onebreath.it'}>
    <header class='domainchange'>
      <p>
        Ci siamo trasferiti su&nbsp;
        <a href='https://soci.onebreath.it' target='_blank'>https://soci.onebreath.it</a>
        <br />
        <b>Dovrai riattivare le notifiche!</b>
      </p>
    </header>
  </Show>
)

export default DomainChangeAlert
