/* @refresh reload */
import { lazy } from 'solid-js'
import { render } from 'solid-js/web'
import { Route, Router } from '@solidjs/router'
import { Provider } from './utils/context'
import Home from './pages/Home'
import './index.sass'
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Settings = lazy(() => import('./pages/Settings'))
const Notifications = lazy(() => import('./pages/settings/Notifications'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))

const root = document.getElementById('root')

render(
  () => (
    <Router root={Provider}>
      <Route path='/' component={Home} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
      <Route path='/settings'>
        <Route path='/' component={Settings} />
        <Route path='/notifications' component={Notifications} />
      </Route>
      <Route path='/leaderboard' component={Leaderboard} />
    </Router>
  ),
  root!
)

if (import.meta.env.PROD) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
    })
  } else { console.error('serviceWorker not in navigator') }
}
