import { useNavigate } from '@solidjs/router'
import { useSupabase } from '../utils/context'

const CheckLogin = () => {
  const navigate = useNavigate()
  const supabaseClient = useSupabase()!

  supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session === null) navigate('/login')
  })
  return null
}

export default CheckLogin
