const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const API_BASE_URL = `${SUPABASE_URL}/functions/v1`;

export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,

    // Country endpoints
    COUNTRIES: `${API_BASE_URL}/api/countries`,
    ACTIVE_COUNTRIES: `${API_BASE_URL}/api/countries/active`,

    // Plan endpoints
    ALL_PLANS: `${API_BASE_URL}/api/all-plans`,
    PLANS: `${API_BASE_URL}/api/plans`,
    PLANS_BY_COUNTRY: (countryId) => `${API_BASE_URL}/api/plans/country/${countryId}`,
    PLAN_BY_ID: (id) => `${API_BASE_URL}/api/plans/${id}`,

    // User endpoints
    UPDATE_USER_COUNTRY: `${API_BASE_URL}/api/user/country`,

    // Admin endpoints
    ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
};

export default API_BASE_URL;
