const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const API_BASE_URL = `${SUPABASE_URL}/functions/v1`;

export const getHeaders = () => ({
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
});

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
    ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
    ADMIN_SUSPEND_USER: (id) => `${API_BASE_URL}/api/admin/users/${id}/suspend`,
    ADMIN_SEND_MESSAGE: `${API_BASE_URL}/api/admin/messages`,
    ADMIN_SEND_BULK_MESSAGE: `${API_BASE_URL}/api/admin/messages/bulk`,

    // User messaging endpoints
    USER_MESSAGES: (userId) => `${API_BASE_URL}/api/user/messages/${userId}`,
    MARK_MESSAGE_READ: (messageId) => `${API_BASE_URL}/api/user/messages/${messageId}/read`,

    // Subscription endpoints
    SUBSCRIBE: `${API_BASE_URL}/api/user/subscribe`,
    USER_SUBSCRIPTIONS: (userId) => `${API_BASE_URL}/api/user/subscriptions/${userId}`,
};

export default API_BASE_URL;
