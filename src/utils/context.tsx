import { createContext, useContext, type ParentComponent } from 'solid-js'
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClientDB } from './shortcut.types'
import DomainChangeAlert from '../components/DomainChangeAlert'

const supabaseContext = createContext<SupabaseClientDB>()

export const Provider: ParentComponent = (props) => {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  )

  return (
    <supabaseContext.Provider value={supabase}>
      <DomainChangeAlert />
      {props.children}
    </supabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(supabaseContext)
  if (!context) throw new Error('can\'t find supabaseContext')
  return context
}
