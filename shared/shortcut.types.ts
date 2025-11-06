import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types.ts'

export type SupabaseClientDB = SupabaseClient<Database>
