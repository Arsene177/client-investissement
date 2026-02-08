# Prosper Invest - Investment Management Platform

A modern, full-stack investment management platform with role-based dashboards for administrators and clients.

## Features

### Admin Dashboard
- **Portfolio Management**: Full CRUD operations for investment plans
- **Country Code Input**: Fast jurisdiction targeting using ISO codes (US, FR) or phone codes (1, 237)
- **Real-time Statistics**: Dynamic metrics showing total users, active plans, and AUM
- **Global Plans**: Support for worldwide investment opportunities

### Client Dashboard
- **Country Selection**: Dynamic country selector showing only jurisdictions with active plans
- **Investment Portfolios**: View curated investment opportunities based on selected region
- **Multi-language Support**: English and French translations

## Tech Stack

### Frontend
- React + Vite
- Lucide React (icons)
- Custom CSS with modern design patterns

### Backend
- Node.js + Express
- MySQL database
- bcryptjs for authentication
- CORS enabled

## Getting Started

### Prerequisites
- Node.js (v14+)
- MySQL (via WAMPP or standalone)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Arsene177/client-investissement.git
cd client-investissement
```

2. Install dependencies:
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

3. Configure environment variables:
Create a `.env` file in the `backend` directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=aureus_wealth
PORT=5000
```

4. Initialize the database:
```bash
npm run db:sync
```

5. Start the development servers:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

## Default Credentials

**Admin Account:**
- Username: `admin_user`
- Password: `password`

## Project Structure

```
prosper-invest/
├── backend/
│   ├── scripts/
│   │   └── sync-db.js
│   ├── server.js
│   └── package.json
├── database/
│   └── schema.sql
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LoginModal.jsx
│   │   └── ...
│   ├── LanguageContext.jsx
│   └── translations.js
└── package.json
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

## License

MIT
