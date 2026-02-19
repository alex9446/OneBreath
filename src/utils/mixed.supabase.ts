import type { SupabaseClientDB } from './shortcut.types'
import { setAdminInLS, setGroupInLS, userStatusRaw } from './mixed'
import type { Enums, Tables } from './database.types'

export const getUserId = async (supabaseClient: SupabaseClientDB) => {
  const { data: { session }, error } = await supabaseClient.auth.getSession()
  if (error) throw error.message
  if (!session) throw 'session is null'
  return session.user.id
}

export const fillLocalStorage = async (supabaseClient: SupabaseClientDB, userId: string) => {
  const profileProm = supabaseClient.from('profiles')
    .select('group_id').eq('id', userId).single()
  const adminProm = supabaseClient.from('admins')
    .select('level').eq('id', userId).maybeSingle()
  const [profile, admin] = await Promise.all([profileProm, adminProm])

  if (profile.error) throw profile.error.message
  if (admin.error) throw admin.error.message

  setGroupInLS(profile.data.group_id)
  setAdminInLS(admin.data?.level ?? 0)
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
  const certificateProm = supabaseClient.from('certificates')
    .select('expiration').eq('user_id', userId).maybeSingle()
  const paymentProm = supabaseClient.from('payments')
    .select('expiration').eq('user_id', userId).maybeSingle()
  const [certificate, payment] = await Promise.all([certificateProm, paymentProm])

  return userStatusRaw(certificate.data?.expiration, payment.data?.expiration)
}

export const profilesWithStatus = async (supabaseClient: SupabaseClientDB) => {
  const profilesProm = supabaseClient.from('profiles')
    .select('id,first_name,last_name,group_id').order('first_name')
  const certificatesProm = supabaseClient.from('certificates').select('user_id,expiration')
  const paymentsProm = supabaseClient.from('payments').select('user_id,expiration')
  const [profiles, certificates, payments] = await Promise.all(
    [profilesProm, certificatesProm, paymentsProm]
  )
  if (profiles.error) throw profiles.error.message
  if (certificates.error) throw certificates.error.message
  if (payments.error) throw payments.error.message

  const certificateByUserId = new Map(certificates.data.map((certificate) => (
    [certificate.user_id, certificate.expiration]
  )))
  const paymentByUserId = new Map(payments.data.map((payment) => (
    [payment.user_id, payment.expiration]
  )))

  return profiles.data.map((profile) => ({
    ...profile,
    status: userStatusRaw(certificateByUserId.get(profile.id), paymentByUserId.get(profile.id))
  }))
}
