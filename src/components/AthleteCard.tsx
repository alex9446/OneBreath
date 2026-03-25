import type { Component } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import type { Tables } from '../utils/database.types'
import type { userStatusRaw } from '../utils/mixed'
import { mdiCashSync, mdiClipboardPulseOutline, mdiShieldCrownOutline } from '../utils/iconPaths'
import Icon from './Icon'
import './AthleteCard.sass'

type AthleteCardProps = {
  profile: Pick<Tables<'profiles'>, 'id' | 'first_name' | 'last_name'> & {
    groupName: string
    status: ReturnType<typeof userStatusRaw>
  }
  isAdmin: boolean
}

const AthleteCard: Component<AthleteCardProps> = (props) => {
  const navigate = useNavigate()

  return (
    <article class='athlete-card' onClick={() => navigate(props.profile.id)}>
      <h5>{props.profile.first_name} {props.profile.last_name}</h5>
      <p>{props.profile.groupName}</p>
      <div class='icons'>
        <Icon path={mdiShieldCrownOutline} classList={{ admin: true, hide: !props.isAdmin }} />
        <Icon path={mdiClipboardPulseOutline} classList={props.profile.status.certificate} />
        <Icon path={mdiCashSync} classList={props.profile.status.payment} />
      </div>
    </article>
  )
}

export default AthleteCard
