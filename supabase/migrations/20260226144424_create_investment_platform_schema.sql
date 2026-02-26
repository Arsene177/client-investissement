/*
  # Create Investment Platform Schema

  ## Overview
  Complete database schema for AUREUS Wealth Management investment platform
  with support for multi-country investment plans and user management.

  ## New Tables

  ### 1. countries
  - `id` (bigint, primary key)
  - `name` (text) - Country full name
  - `code` (text, unique) - ISO 2-letter code (US, FR, etc.)
  - `phone_code` (text) - International calling code
  - `flag` (text) - Country flag emoji
  - `created_at` (timestamptz)

  ### 2. users
  - `id` (uuid, primary key, default: gen_random_uuid())
  - `username` (text, unique) - User login name
  - `email` (text, unique) - User email
  - `password` (text) - Hashed password
  - `role` (text) - 'client' or 'admin'
  - `full_name` (text) - User's full name
  - `phone` (text) - Phone number
  - `country_id` (bigint) - FK to countries (user's home country)
  - `selected_country_id` (bigint) - FK to countries (selected investment region)
  - `created_at` (timestamptz)
  - `last_login` (timestamptz)

  ### 3. investment_plans
  - `id` (bigint, primary key)
  - `name` (text) - Plan name
  - `roi` (text) - Return on investment percentage
  - `min_deposit` (text) - Minimum deposit amount
  - `settlement_time` (text) - Settlement period (default: 24H)
  - `risk` (text) - Risk level: Low, Moderate, High, Very High
  - `focus` (text) - Investment focus description
  - `description_en` (text) - English description
  - `description_fr` (text) - French description
  - `badge` (text) - Badge type (STANDARD, STARTER, POPULAR, PREMIUM, EXCLUSIVE)
  - `display_order` (int) - Display order for sorting
  - `is_active` (boolean) - Active status
  - `country_id` (bigint) - FK to countries (NULL = Global plan)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can read their own data
  - Users can read active investment plans
  - Users can read countries
  - Only admins can modify plans
  - Public read access to countries and active plans

  ## Indexes
  - Index on investment_plans.country_id for fast filtering
  - Index on investment_plans.is_active for active plan queries
  - Index on investment_plans.display_order for sorting
*/

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    phone_code TEXT,
    flag TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    full_name TEXT,
    phone TEXT,
    country_id BIGINT REFERENCES countries(id),
    selected_country_id BIGINT REFERENCES countries(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ
);

-- Create investment_plans table
CREATE TABLE IF NOT EXISTS investment_plans (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    roi TEXT NOT NULL,
    min_deposit TEXT NOT NULL,
    settlement_time TEXT DEFAULT '24H',
    risk TEXT DEFAULT 'Moderate' CHECK (risk IN ('Low', 'Moderate', 'High', 'Very High')),
    focus TEXT,
    description_en TEXT,
    description_fr TEXT,
    badge TEXT DEFAULT 'STANDARD',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    country_id BIGINT REFERENCES countries(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_plans_country ON investment_plans(country_id);
CREATE INDEX IF NOT EXISTS idx_plans_active ON investment_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_plans_order ON investment_plans(display_order);

-- Enable Row Level Security
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for countries (public read)
CREATE POLICY "Countries are viewable by everyone"
  ON countries FOR SELECT
  TO public
  USING (true);

-- RLS Policies for users
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for investment_plans
CREATE POLICY "Active plans viewable by everyone"
  ON investment_plans FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "All plans viewable by admins"
  ON investment_plans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert plans"
  ON investment_plans FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update plans"
  ON investment_plans FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete plans"
  ON investment_plans FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Insert seed data for countries
INSERT INTO countries (id, name, code, phone_code, flag) VALUES 
(1, 'USA', 'US', '1', '🇺🇸'),
(2, 'France', 'FR', '33', '🇫🇷'),
(3, 'Cameroon', 'CM', '237', '🇨🇲'),
(4, 'Nigeria', 'NG', '234', '🇳🇬'),
(5, 'United Kingdom', 'GB', '44', '🇬🇧'),
(6, 'Germany', 'DE', '49', '🇩🇪'),
(7, 'Canada', 'CA', '1', '🇨🇦'),
(8, 'Japan', 'JP', '81', '🇯🇵'),
(9, 'China', 'CN', '86', '🇨🇳'),
(10, 'Australia', 'AU', '61', '🇦🇺'),
(11, 'Brazil', 'BR', '55', '🇧🇷'),
(12, 'South Africa', 'ZA', '27', '🇿🇦'),
(13, 'Ivory Coast', 'CI', '225', '🇨🇮'),
(14, 'Senegal', 'SN', '221', '🇸🇳'),
(15, 'United Arab Emirates', 'AE', '971', '🇦🇪'),
(16, 'Switzerland', 'CH', '41', '🇨🇭'),
(17, 'Singapore', 'SG', '65', '🇸🇬'),
(18, 'India', 'IN', '91', '🇮🇳'),
(19, 'Mexico', 'MX', '52', '🇲🇽'),
(20, 'Egypt', 'EG', '20', '🇪🇬')
ON CONFLICT (code) DO NOTHING;

-- Insert admin user (password: 'password')
-- Using bcrypt hash for 'password'
INSERT INTO users (username, email, password, full_name, role)
VALUES (
  'admin_user',
  'admin@prosperinvest.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'System Admin',
  'admin'
)
ON CONFLICT (username) DO NOTHING;
