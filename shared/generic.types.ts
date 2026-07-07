export type NotificationPayload = {
  title: string
  badge?: string
  body?: string
  icon?: string
  lang?: string
  requireInteraction?: boolean
  silent?: boolean | null
  tag?: string
  url?: string
}
