export const sendHeartbeat = async (startSignal?: boolean, url?: URL) => {
  const req_url = url?.href ?? Deno.env.get('HEARTBEAT_URL')
  if (!req_url) {
    console.warn('heartbeat url not found!', req_url)
    return false
  }
  const path = startSignal ? '/start' : ''
  return (await fetch(req_url + path)).ok
}
