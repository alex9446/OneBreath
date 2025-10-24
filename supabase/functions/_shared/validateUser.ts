import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import type { Database } from '../_shared/database.types.ts'
import * as uuid from 'jsr:@std/uuid@1'


export async function validateUser(authorization_header: string | null,
                                   supabaseAdmin: SupabaseClient<Database>) {
  if (!authorization_header) return { message: 'missing authorization header!', code: 401 }
  const token = authorization_header.replace('Bearer ', '')
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error) return { message: error.message, code: 401 }
  if (!user || !uuid.validate(user.id)) return { message: 'user.id not valid!', code: 401 }
  return { message: 'ok', code: 200, userId: user.id }
}
