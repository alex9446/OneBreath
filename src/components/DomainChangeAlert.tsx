import Cookies from 'js-cookie'
import './DomainChangeAlert.sass'

const DomainChangeAlert = () => {
  const autoShowModal = (dialogElement: HTMLDialogElement) => {
    const noHideCookie = !Cookies.get('hideDCA')
    const originNotMatch = window.location.origin !== 'https://soci.onebreath.it'
    // queueMicrotask to wait until the component is mounted
    if (noHideCookie && originNotMatch) queueMicrotask(() => dialogElement.showModal())
  }

  const handleClose = () => Cookies.set('hideDCA', 'yes', { expires: 1 })

  return (
    <dialog ref={autoShowModal} class='domainchange' closedby='any' onClose={handleClose}>
      <p>
        Ci siamo trasferiti su&nbsp;
        <a href='https://soci.onebreath.it' target='_blank'>https://soci.onebreath.it</a>
        <br />
        <b>Dovrai riattivare le notifiche!</b>
      </p>
      <form method='dialog'>
        <button>Nascondi temporaneamente avviso</button>
      </form>
    </dialog>
  )
}

export default DomainChangeAlert
