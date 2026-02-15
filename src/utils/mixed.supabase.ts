import type { SupabaseClientDB } from './shortcut.types'
import { expirationStatus, setAdminInLS, setGroupInLS } from './mixed'
import type { Enums, Tables } from './database.types'

export const getUserId = async (supabaseClient: SupabaseClientDB) => {
  const { data: { session }, error } = await supabaseClient.auth.getSession()
  if (error) throw error.message
  if (!session) throw 'session is null'
  return session.user.id
}

export const fillLocalStorage = async (supabaseClient: SupabaseClientDB, userId: string) => {
  const { data: profile, error: profileError } = await supabaseClient.from('profiles')
    .select('group_id').eq('id', userId).single()
  if (profileError) throw profileError.message
  setGroupInLS(profile.group_id)

  const { data: admin, error: adminError } = await supabaseClient.from('admins')
    .select('level').eq('id', userId).maybeSingle()
  if (adminError) throw adminError.message
  setAdminInLS(admin ? admin.level : 0)
}

export const contactsByZone = async (supabaseClient: SupabaseClientDB) => {
  const { data: contacts, error } = await supabaseClient.from('sportexam_contacts')
    .select('name,phone_number,notes,zone').order('id')
  if (error) throw error.message

  return contacts.reduce((acc, contact) => {
    const existingIndex = acc.findIndex((c) => c.zone === contact.zone)
    if (existingIndex >= 0) acc[existingIndex].contacts.push(contact)
    else acc.push({zone: contact.zone, contacts: [contact]})
    return acc
  }, [] as Array<{
    zone: Enums<'zones'>,
    contacts: Omit<Tables<'sportexam_contacts'>, 'id'>[]
  }>)
}

export const userStatus = async (supabaseClient: SupabaseClientDB,
                                 idPromise?: Promise<string>) => {
  const userId = await idPromise ?? await getUserId(supabaseClient)
  const { data: certData, error: certError } = await supabaseClient.from('certificates')
    .select('expiration').eq('user_id', userId).maybeSingle()
  if (certError) throw certError.message
  const { data: paymentData, error: paymentError } = await supabaseClient.from('payments')
    .select('expiration').eq('user_id', userId).maybeSingle()
  if (paymentError) throw paymentError.message

  const certificate = expirationStatus(certData, 30)
  const payment = expirationStatus(paymentData, 10)
  return {
    certificate,
    certificateExpiration: certData?.expiration,
    payment,
    paymentExpiration: paymentData?.expiration,
    global: {
      notfound: certificate.notfound || payment.notfound,
      expired: certificate.expired || payment.expired,
      almostExpired: certificate.almostExpired || payment.almostExpired
    }
  }
}
