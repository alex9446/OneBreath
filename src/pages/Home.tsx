import { A } from '@solidjs/router'
import CheckLogin from '../utils/CheckLogin'

const Home = () => (
  <>
    <CheckLogin />
    <A href='/login'>Login</A><br/>
    <A href='/register'>Register</A>
  </>
)

export default Home
