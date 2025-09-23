// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js@2/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

console.info(`Edge function "example" up and running!`)

Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok')
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabase = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // First get the token from the Authorization header
    const token = req.headers.get('Authorization').replace('Bearer ', '')

    // Now we can get the session or user object
    const { data: { user } } = await supabase.auth.getUser(token)

    // And we can run queries in the context of our authenticated user
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) throw error

    return new Response(JSON.stringify({ user, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (err) {
    return new Response(JSON.stringify({ message: err?.message ?? err }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
