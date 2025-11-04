import type { SupabaseClient } from '@supabase/supabase-js'
import { validate } from 'uuid'
import type { Database } from '../_shared/database.types.ts'
import { FunctionReturn } from './mixed.types.ts'


type ReturnType = FunctionReturn<{ userId: string }>

const errorMessage = (message: string) => ({ data: null, error: { message, code: 401 } })

export async function validateUser(authorization_header: string | null,
                                   supabaseAdmin: SupabaseClient<Database>): ReturnType {
  if (!authorization_header) return errorMessage('missing authorization header!')
  const token = authorization_header.replace('Bearer ', '')
  const { data, error } = await supabaseAdmin.auth.getClaims(token)
  if (error) return errorMessage(error.message)
  if (!data) return errorMessage('no data in getClaims!')
  const { claims: { sub: userId, role } } = data
  if (role !== 'authenticated') return errorMessage('unauthenticated role!')
  if (!validate(userId)) return errorMessage('userId not valid!')
  return { data: { userId }, error: null }
}
