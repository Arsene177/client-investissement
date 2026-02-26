import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone: string;
  country_id: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const pathname = url.pathname;

    if (pathname.endsWith('/login') && req.method === 'POST') {
      const { username, password }: LoginRequest = await req.json();

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (error || !user) {
        return new Response(
          JSON.stringify({ message: 'User not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const bcrypt = await import('https://deno.land/x/bcrypt@v0.4.1/mod.ts');
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return new Response(
          JSON.stringify({ message: 'Invalid credentials' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      const { password: _, ...userWithoutPassword } = user;

      return new Response(
        JSON.stringify({
          success: true,
          user: userWithoutPassword,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (pathname.endsWith('/register') && req.method === 'POST') {
      const {
        username,
        email,
        password,
        full_name,
        phone,
        country_id,
      }: RegisterRequest = await req.json();

      const { data: existingUser } = await supabase
        .from('users')
        .select('username, email')
        .or(`username.eq.${username},email.eq.${email}`)
        .maybeSingle();

      if (existingUser) {
        if (existingUser.username === username) {
          return new Response(
            JSON.stringify({ message: 'Username already exists' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
        if (existingUser.email === email) {
          return new Response(
            JSON.stringify({ message: 'Email already exists' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }

      const bcrypt = await import('https://deno.land/x/bcrypt@v0.4.1/mod.ts');
      const hashedPassword = await bcrypt.hash(password);

      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          username,
          email,
          password: hashedPassword,
          full_name,
          phone,
          country_id,
          selected_country_id: country_id,
          role: 'client',
        })
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ message: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const { password: _, ...userWithoutPassword } = newUser;

      return new Response(
        JSON.stringify({
          success: true,
          user: userWithoutPassword,
        }),
        {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Not found' }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
