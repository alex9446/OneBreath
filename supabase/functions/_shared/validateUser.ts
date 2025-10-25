import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import type { Database } from '../_shared/database.types.ts'
import { FunctionReturn } from './mixed.types.ts'
import * as uuid from 'jsr:@std/uuid@1'


const errorMessage = (message: string) => ({ error: { message, code: 401 } })

export async function validateUser(authorization_header: string | null,
                                   supabaseAdmin: SupabaseClient<Database>): FunctionReturn {
  if (!authorization_header) return errorMessage('missing authorization header!')
  const token = authorization_header.replace('Bearer ', '')
  const { data, error } = await supabaseAdmin.auth.getClaims(token)
  if (error) return errorMessage(error.message)
  if (!data) return errorMessage('no data in getClaims!')
  const { claims: { sub: userId, role } } = data
  if (role !== 'authenticated') return errorMessage('unauthenticated role!')
  if (!uuid.validate(userId)) return errorMessage('userId not valid!')
  return { data: { userId }, error: null }
}
