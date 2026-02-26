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
    const pathParts = pathname.split('/').filter(Boolean);

    // GET /api/countries - Get all countries
    if (pathname.includes('/countries') && !pathname.includes('/active') && req.method === 'GET') {
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
    if (pathname.includes('/countries/active') && req.method === 'GET') {
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
    if (pathname.includes('/plans/country/') && req.method === 'GET') {
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
    if (pathname.includes('/all-plans') && req.method === 'GET') {
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
    if (pathname.includes('/plans') && req.method === 'POST' && !pathname.includes('/plans/')) {
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
    if (pathname.includes('/plans/') && req.method === 'PUT') {
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
    if (pathname.includes('/plans/') && req.method === 'DELETE') {
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
    if (pathname.includes('/user/country') && req.method === 'PUT') {
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
    if (pathname.includes('/admin/stats') && req.method === 'GET') {
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: totalPlans } = await supabase
        .from('investment_plans')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      return new Response(
        JSON.stringify({
          totalUsers: totalUsers || 0,
          totalPlans: totalPlans || 0,
          globalAUM: '$2.4B',
        }),
        {
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
