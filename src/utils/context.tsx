import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createContext, useContext, type ParentComponent } from 'solid-js'
import { type Database } from './database.types'

const supabaseContext = createContext<SupabaseClient<Database>>()

export const Provider: ParentComponent = (props) => {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  )

  return (
    <supabaseContext.Provider value={supabase}>{props.children}</supabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(supabaseContext)
  if (!context) throw new Error('can\'t find supabaseContext')
  return context
}
