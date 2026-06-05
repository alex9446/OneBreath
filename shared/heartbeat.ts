export const sendHeartbeat = async (url?: URL) => {
  const req_url = url?.href ?? Deno.env.get('HEARTBEAT_URL')
  if (!req_url) {
    console.warn('heartbeat url not found!', req_url)
    return false
  }
  return (await fetch(req_url)).ok
}
