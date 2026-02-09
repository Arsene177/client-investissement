# Prosper Invest - Backend API

Backend API for the Prosper Invest investment management platform.

## Tech Stack

- Node.js + Express
- MySQL database
- bcryptjs for authentication
- CORS enabled

## Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=aureus_wealth
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### Countries & Plans
- `GET /api/countries` - Get all countries
- `GET /api/countries/active` - Get countries with active plans
- `GET /api/plans/country/:id` - Get plans for specific country
- `GET /api/all-plans` - Get all plans (admin)

### Admin
- `POST /api/plans` - Create new plan
- `PUT /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete plan
- `GET /api/admin/stats` - Get platform statistics
- `PUT /api/user/country` - Update user's selected country

## Deployment

This backend is configured for deployment to Railway. See `.env.example` for required environment variables.

## License

MIT
