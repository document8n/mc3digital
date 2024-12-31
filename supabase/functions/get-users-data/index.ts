import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting get-users-data function...')
    
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the user is authenticated and has admin role
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      console.error('Authentication error:', userError)
      throw new Error('Not authenticated')
    }

    console.log('Checking admin status for user:', user.id)

    // Check if user has admin role using user_private table
    const { data: privateData, error: privateError } = await supabaseAdmin
      .from('user_private')
      .select('role')
      .eq('id', user.id)
      .single()

    if (privateError) {
      console.error('Error fetching user role:', privateError)
      throw new Error('Error checking user role')
    }

    if (privateData?.role !== 'admin') {
      console.error('User is not an admin:', user.id)
      throw new Error('Not authorized')
    }

    console.log('User is authorized as admin, fetching users list...')

    // Fetch all users
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    if (usersError) {
      console.error('Error fetching users:', usersError)
      throw usersError
    }

    console.log('Successfully fetched users data')

    return new Response(
      JSON.stringify({ users: users.users }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Function error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})