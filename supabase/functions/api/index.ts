import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

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

    console.log(`[API Function] Request: ${req.method} ${pathname}`);

    // Remove /functions/v1/api or /api if present at the start to get the internal route
    let normalizedPath = pathname;
    if (normalizedPath.startsWith('/functions/v1/api')) {
      normalizedPath = normalizedPath.replace('/functions/v1/api', '/api');
    } else if (normalizedPath.startsWith('/functions/v1')) {
      // In case it's called as /functions/v1/user/subscribe instead of /functions/v1/api/user/subscribe
      normalizedPath = normalizedPath.replace('/functions/v1', '/api');
    }

    // Ensure it starts with /api
    if (!normalizedPath.startsWith('/api')) {
      normalizedPath = '/api' + (normalizedPath.startsWith('/') ? '' : '/') + normalizedPath;
    }

    // Remove trailing slash for consistency
    if (normalizedPath.endsWith('/') && normalizedPath.length > 1) {
      normalizedPath = normalizedPath.slice(0, -1);
    }

    console.log(`[API Function] Normalized Path: ${normalizedPath}`);

    const pathParts = normalizedPath.split('/').filter(Boolean);

    // Helper to check if normalized path matches a pattern
    const matches = (pattern: string) => {
      const sanitizedPattern = pattern.endsWith('/') ? pattern.slice(0, -1) : pattern;
      return normalizedPath === sanitizedPattern || normalizedPath.startsWith(sanitizedPattern + '/');
    };

    // GET /api/countries - Get all countries
    if (normalizedPath === '/api/countries' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /api/countries/active - Get countries with active plans
    if (normalizedPath === '/api/countries/active' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('countries')
        .select(`
          *,
          investment_plans!inner(id)
        `)
        .eq('investment_plans.is_active', true)
        .order('name');

      if (error) throw error;

      const uniqueCountries = Array.from(
        new Map(data.map(item => [item.id, item])).values()
      ).map(({ investment_plans, ...country }) => country);

      return new Response(JSON.stringify(uniqueCountries), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /api/plans/country/:id - Get plans for specific country
    if (matches('/api/plans/country') && req.method === 'GET') {
      const countryId = pathParts[pathParts.length - 1];

      const { data, error } = await supabase
        .from('investment_plans')
        .select(`
          *,
          countries(name, code, flag, phone_code)
        `)
        .eq('is_active', true)
        .or(`country_id.eq.${countryId},country_id.is.null`)
        .order('display_order');

      if (error) throw error;

      const formattedData = data.map(plan => ({
        ...plan,
        country_name: plan.countries?.name,
        country_code: plan.countries?.code,
        country_flag: plan.countries?.flag,
        phone_code: plan.countries?.phone_code,
      }));

      return new Response(JSON.stringify(formattedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /api/all-plans - Get all plans (admin)
    if (normalizedPath === '/api/all-plans' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('investment_plans')
        .select(`
          *,
          countries(name, code, flag, phone_code)
        `)
        .order('display_order');

      if (error) throw error;

      const formattedData = data.map(plan => ({
        ...plan,
        country_name: plan.countries?.name,
        country_code: plan.countries?.code,
        country_flag: plan.countries?.flag,
        phone_code: plan.countries?.phone_code,
      }));

      return new Response(JSON.stringify(formattedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /api/plans - Create new plan
    if (normalizedPath === '/api/plans' && req.method === 'POST') {
      const body = await req.json();

      let countryId = body.country_id;
      if (body.country_code_input && body.country_code_input !== 'GLOBAL') {
        const { data: country } = await supabase
          .from('countries')
          .select('id')
          .or(`code.eq.${body.country_code_input},phone_code.eq.${body.country_code_input}`)
          .maybeSingle();

        if (country) {
          countryId = country.id;
        }
      } else if (body.country_code_input === 'GLOBAL') {
        countryId = null;
      }

      const { data, error } = await supabase
        .from('investment_plans')
        .insert({
          name: body.name,
          roi: body.roi,
          min_deposit: body.min_deposit,
          settlement_time: body.settlement_time || '24H',
          risk: body.risk || 'Moderate',
          focus: body.focus,
          description_en: body.description_en,
          description_fr: body.description_fr,
          badge: body.badge || 'STANDARD',
          display_order: body.display_order || 0,
          is_active: body.is_active !== undefined ? body.is_active : true,
          country_id: countryId,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, data }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT /api/plans/:id - Update plan
    if (matches('/api/plans') && req.method === 'PUT' && !normalizedPath.endsWith('/suspend')) {
      const planId = pathParts[pathParts.length - 1];
      const body = await req.json();

      let countryId = body.country_id;
      if (body.country_code_input && body.country_code_input !== 'GLOBAL') {
        const { data: country } = await supabase
          .from('countries')
          .select('id')
          .or(`code.eq.${body.country_code_input},phone_code.eq.${body.country_code_input}`)
          .maybeSingle();

        if (country) {
          countryId = country.id;
        }
      } else if (body.country_code_input === 'GLOBAL') {
        countryId = null;
      }

      const { data, error } = await supabase
        .from('investment_plans')
        .update({
          name: body.name,
          roi: body.roi,
          min_deposit: body.min_deposit,
          settlement_time: body.settlement_time,
          risk: body.risk,
          focus: body.focus,
          description_en: body.description_en,
          description_fr: body.description_fr,
          badge: body.badge,
          display_order: body.display_order,
          is_active: body.is_active,
          country_id: countryId,
        })
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /api/plans/:id - Delete plan
    if (matches('/api/plans') && req.method === 'DELETE') {
      const planId = pathParts[pathParts.length - 1];

      const { error } = await supabase
        .from('investment_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT /api/user/country - Update user's selected country
    if (normalizedPath === '/api/user/country' && req.method === 'PUT') {
      const { userId, countryId } = await req.json();

      const { data, error } = await supabase
        .from('users')
        .update({ selected_country_id: countryId })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      const { password: _, ...userWithoutPassword } = data;

      return new Response(
        JSON.stringify({ success: true, user: userWithoutPassword }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // GET /api/admin/stats - Get admin statistics
    if (normalizedPath === '/api/admin/stats' && req.method === 'GET') {
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: totalClients } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client');

      const { count: totalPlans } = await supabase
        .from('investment_plans')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      console.log(`[Admin Stats] Users: ${totalUsers}, Clients: ${totalClients}, Plans: ${totalPlans}`);

      return new Response(
        JSON.stringify({
          totalUsers: totalUsers || 0,
          totalClients: totalClients || 0,
          totalPlans: totalPlans || 0,
          globalAUM: '$2.4B',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // GET /api/admin/users - Get all users with search and plan filter
    if (normalizedPath === '/api/admin/users' && req.method === 'GET') {
      const search = url.searchParams.get('search');
      const planId = url.searchParams.get('planId');

      console.log(`[Admin Users] Fetching users (SIMPLIFIED). Search: ${search}, PlanId: ${planId}`);

      try {
        let query = supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (search) {
          query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,username.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        const { data: usersData, error: usersError } = await supabase.from('users').select('*');

        if (usersError) {
          console.error('[Admin Users] Query Error:', usersError);
          return new Response(JSON.stringify({ 
             error: usersError.message, 
             details: usersError.details, 
             hint: usersError.hint,
             code: usersError.code
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log(`[Admin Users] Found ${usersData?.length || 0} users in database`);

        if (!usersData || usersData.length === 0) {
           // Return a diagnostic user if empty
           return new Response(JSON.stringify([{
              id: '00000000-0000-0000-0000-000000000000',
              full_name: 'No Users in DB - Checking Configuration...',
              username: 'system_diag',
              email: 'check-db@prosper.com',
              role: 'system'
           }]), {
             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
           });
        }

        // Fetch related tables
        const [
          { data: countriesArray },
          { data: plansArray },
          { data: subsArray }
        ] = await Promise.all([
          supabase.from('countries').select('*'),
          supabase.from('investment_plans').select('*'),
          supabase.from('user_subscriptions').select('*').eq('status', 'active')
        ]);

        // Flatten data for frontend: find active subscription and attach its plan
        const processedData = usersData.map((user: any) => {
          const userSubs = subsArray?.filter((s: any) => s.user_id === user.id) || [];
          const activeSub = userSubs[0];

          let currentPlan = null;
          if (activeSub) {
             currentPlan = plansArray?.find((p: any) => p.id === activeSub.plan_id);
          } else if (user.plan_id) {
             currentPlan = plansArray?.find((p: any) => p.id === user.plan_id);
          }

          const userCountry = countriesArray?.find((c: any) => c.id === user.country_id || c.id === user.selected_country_id);

          return {
            ...user,
            countries: userCountry,
            investment_plans: currentPlan
          };
        });

        // Filter by planId if specified
        let filteredData = processedData;
        if (planId && planId !== 'all') {
          filteredData = processedData.filter((user: any) => {
            const up = user.investment_plans as any;
            return up?.id?.toString() === planId;
          });
        }

        console.log(`[Admin Users] Returning ${filteredData.length} processed users`);

        return new Response(JSON.stringify(filteredData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        console.error('[Admin Users] Critical Error:', err);
        return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // PUT /api/admin/users/:id/suspend - Suspend/Unsuspend user
    if (matches('/api/admin/users') && normalizedPath.endsWith('/suspend') && req.method === 'PUT') {
      const parts = pathParts;
      const userId = parts[parts.indexOf('users') + 1];
      const { suspended } = await req.json();

      const { data, error } = await supabase
        .from('users')
        .update({ is_suspended: suspended })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /api/admin/messages/bulk - Admin sends message to multiple users
    if (normalizedPath === '/api/admin/messages/bulk' && req.method === 'POST') {
      try {
        const { sender_id, receiver_ids, subject, content } = await req.json();
        console.log(`[Admin Bulk Message] From ${sender_id} to ${receiver_ids?.length} users`);

        if (!sender_id || !Array.isArray(receiver_ids) || receiver_ids.length === 0 || !content) {
          return new Response(JSON.stringify({ message: 'Missing required fields (sender_id, receiver_ids, or content)' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const messages = receiver_ids.map(id => ({
          sender_id,
          receiver_id: id,
          subject,
          content,
        }));

        const { data, error } = await supabase
          .from('user_messages')
          .insert(messages)
          .select();

        if (error) {
          console.error('[Admin Bulk Message] Insert Error:', error);
          return new Response(JSON.stringify({ error: error.message, message: error.message, details: error.details }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true, count: data.length }), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        console.error('[Admin Bulk Message] Exception:', err);
        return new Response(JSON.stringify({ error: err.message, message: err.message, stack: err.stack }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // GET /api/admin/messages/conversation/:userId - Get conversation history
    if (normalizedPath.startsWith('/api/admin/messages/conversation/') && req.method === 'GET') {
       const parts = normalizedPath.split('/');
       const otherUserId = parts[parts.length - 1];
       
       console.log(`[Admin Message History] Fetching conversation with user: ${otherUserId}`);
       
       const { data, error } = await supabase
         .from('user_messages')
         .select('*')
         .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
         .order('created_at', { ascending: true });

       if (error) {
         console.error('[Admin Message History] Error:', error);
         return new Response(JSON.stringify({ error: error.message }), { 
           status: 400, 
           headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
         });
       }
       return new Response(JSON.stringify(data), { 
         headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
       });
    }

    // POST /api/admin/messages - Admin sends message to user
    if (normalizedPath === '/api/admin/messages' && req.method === 'POST') {
      try {
        const { sender_id, receiver_id, subject, content } = await req.json();
        console.log(`[Admin Message] From ${sender_id} to ${receiver_id}`);

        if (!sender_id || !receiver_id || !content) {
          return new Response(JSON.stringify({ message: 'Missing required fields (sender_id, receiver_id, or content)' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data, error } = await supabase
          .from('user_messages')
          .insert({
            sender_id,
            receiver_id,
            subject,
            content,
          })
          .select()
          .single();

        if (error) {
          console.error('[Admin Message] Insert Error:', error);
          return new Response(JSON.stringify({ error: error.message, message: error.message, details: error.details }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true, data }), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        console.error('[Admin Message] Exception:', err);
        return new Response(JSON.stringify({ error: err.message, message: err.message, stack: err.stack }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // GET /api/user/messages/:userId - Get messages for a user
    if (matches('/api/user/messages') && !normalizedPath.endsWith('/read') && req.method === 'GET') {
      const userId = pathParts[pathParts.length - 1];

      const { data, error } = await supabase
        .from('user_messages')
        .select(`
          *,
          sender:users!sender_id(full_name, role)
        `)
        .eq('receiver_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT /api/user/messages/:id/read - Mark message as read
    if (matches('/api/user/messages') && normalizedPath.endsWith('/read') && req.method === 'PUT') {
      const messageId = pathParts[pathParts.indexOf('messages') + 1];

      const { data, error } = await supabase
        .from('user_messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /api/user/subscribe - User subscribes to a plan
    if (normalizedPath === '/api/user/subscribe' && req.method === 'POST') {
      const { user_id, plan_id, amount } = await req.json();

      if (!user_id || !plan_id || !amount) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing required fields: user_id, plan_id, or amount'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 1. Create the subscription
      const { data: subData, error: subError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id,
          plan_id,
          amount,
          status: 'active'
        })
        .select()
        .single();

      if (subError) {
        console.error('Subscription Insert Error:', subError);
        return new Response(JSON.stringify({
          success: false,
          error: subError.message || 'Database error creating subscription'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 2. Update user's current plan_id
      const { error: userError } = await supabase
        .from('users')
        .update({ plan_id })
        .eq('id', user_id);

      if (userError) {
        console.error('User Update Error:', userError);
        // We don't necessarily want to fail here if the subscription was created,
        // but it's good to know.
      }

      return new Response(JSON.stringify({ success: true, data: subData }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /api/user/subscriptions/:userId - Get all subscriptions for a user
    if (matches('/api/user/subscriptions') && req.method === 'GET') {
      const userId = pathParts[pathParts.length - 1];

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          investment_plans(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
