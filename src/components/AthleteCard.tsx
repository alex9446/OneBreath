import type { Component } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import type { Tables } from '../utils/database.types'
import GroupName from './GroupName'

type AthleteCardProfile = Pick<Tables<'profiles'>, 'id' | 'first_name' | 'last_name' | 'group_id'>

const AthleteCard: Component<{ profile: AthleteCardProfile, isAdmin: boolean }> = (props) => {
  const navigate = useNavigate()

  return (
    <article onClick={() => navigate(props.profile.id)}>
      <h5>{props.profile.first_name} {props.profile.last_name}{props.isAdmin ? ' ⭐' : ''}</h5>
      <p><GroupName id={props.profile.group_id} /></p>
    </article>
  )
}

export default AthleteCard
