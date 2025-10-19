import { A } from '@solidjs/router'
import CheckLogin from '../components/CheckLogin'

const Home = () => (
  <>
    <p>{localStorage.getItem('group_id')}</p>
    <CheckLogin />
    <A href='/login'>Login</A><br/>
    <A href='/register'>Register</A>
  </>
)

export default Home
