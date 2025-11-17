/* @refresh reload */
import { lazy } from 'solid-js'
import { render } from 'solid-js/web'
import { Route, Router, type MatchFilters } from '@solidjs/router'
import { validate } from 'uuid'
import { Provider } from './utils/context'
import RequireLogin from './components/RequireLogin'
import RequireAdmin from './components/RequireAdmin'
import './index.sass'
const Maintenance = lazy(() => import('./pages/Maintenance'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Home = lazy(() => import('./pages/Home'))
const Settings = lazy(() => import('./pages/Settings'))
const Notifications = lazy(() => import('./pages/settings/Notifications'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const MyAttendances = lazy(() => import('./pages/MyAttendances'))
const Staff = lazy(() => import('./pages/Staff'))
const Athletes = lazy(() => import('./pages/staff/Athletes'))
const Athlete = lazy(() => import('./pages/staff/athletes/Athlete'))
const NotFound = lazy(() => import('./pages/NotFound'))

const root = document.getElementById('root')

const AthleteFilters: MatchFilters = {
  id: (uuid: string) => validate(uuid)
}

render(() => {
  if (['true', '1', 'yes'].includes(import.meta.env.VITE_MAINTENANCE)) {
    return <Router><Route path='*' component={Maintenance} /></Router>
  }
  return (
    <Router root={Provider}>
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
      <Route component={RequireLogin}>
        <Route path='/' component={Home} />
        <Route path='/settings'>
          <Route path='/' component={Settings} />
          <Route path='/notifications' component={Notifications} />
        </Route>
        <Route path='/leaderboard' component={Leaderboard} />
        <Route path='/myattendances' component={MyAttendances} />
        <Route component={RequireAdmin}>
          <Route path='/staff'>
            <Route path='/' component={Staff} />
            <Route path='/athletes'>
              <Route path='/' component={Athletes} />
              <Route path='/:id' component={Athlete} matchFilters={AthleteFilters} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path='*' component={NotFound} />
    </Router>
  )
}, root!)

if (import.meta.env.PROD) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
    })
  } else { console.error('serviceWorker not in navigator') }
}
