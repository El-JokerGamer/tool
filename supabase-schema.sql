-- ============================================
-- Eclesiar Economic Dashboard - Database Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- 1. جدول الدول
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  flag TEXT NOT NULL,
  treasury BIGINT DEFAULT 0,
  population INTEGER DEFAULT 0,
  gdp BIGINT DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  inflation DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  country_id INTEGER REFERENCES countries(id),
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  serial TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended')),
  last_login TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  device_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول الموارد
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  base_price DECIMAL(10,2) DEFAULT 0,
  current_price DECIMAL(10,2) DEFAULT 0,
  change_24h DECIMAL(5,2) DEFAULT 0,
  supply INTEGER DEFAULT 0,
  demand INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. جدول عروض السوق
CREATE TABLE IF NOT EXISTS market_offers (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  resource_id INTEGER REFERENCES resources(id),
  resource_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  country_id INTEGER REFERENCES countries(id),
  country_name TEXT,
  seller TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. جدول عروض العمل
CREATE TABLE IF NOT EXISTS job_offers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  country_id INTEGER REFERENCES countries(id),
  country_name TEXT,
  salary INTEGER DEFAULT 0,
  type TEXT,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. جدول سجل الخزينة
CREATE TABLE IF NOT EXISTS treasury_entries (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount BIGINT DEFAULT 0,
  country_id INTEGER REFERENCES countries(id),
  entry_date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. جدول سجل الأسعار
CREATE TABLE IF NOT EXISTS price_history (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER REFERENCES resources(id),
  price DECIMAL(10,2) DEFAULT 0,
  record_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. جدول أكواد التفعيل
CREATE TABLE IF NOT EXISTS activation_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  duration TEXT NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'used', 'expired')),
  used_by UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. جدول مقارنة الأسعار العالمية
CREATE TABLE IF NOT EXISTS global_market_comparison (
  id SERIAL PRIMARY KEY,
  resource_name TEXT NOT NULL,
  country_id INTEGER REFERENCES countries(id),
  price DECIMAL(10,2) DEFAULT 0,
  record_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. جدول بيانات الإيرادات الشهرية
CREATE TABLE IF NOT EXISTS revenue_data (
  id SERIAL PRIMARY KEY,
  country_id INTEGER REFERENCES countries(id),
  month_name TEXT NOT NULL,
  income BIGINT DEFAULT 0,
  expense BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Insert Initial Data
-- ============================================

-- Insert Countries
INSERT INTO countries (name, flag, treasury, population, gdp, tax_rate, inflation) VALUES
  ('نوفاريا', '🏔️', 2450000, 15420, 8900000, 12, 3.2),
  ('أركاديا', '🌊', 3120000, 22100, 12500000, 15, 2.8),
  ('سولاريا', '☀️', 1890000, 9800, 5600000, 10, 4.1),
  ('فروستلاند', '❄️', 4200000, 31000, 18200000, 18, 1.9),
  ('إيمريون', '🌿', 1560000, 7200, 3800000, 8, 5.3),
  ('ثاندوريا', '⚡', 2780000, 18900, 10200000, 14, 3.7)
ON CONFLICT (name) DO NOTHING;

-- Insert Resources
INSERT INTO resources (name, icon, base_price, current_price, change_24h, supply, demand) VALUES
  ('خشب', '🪵', 45, 52, 5.2, 12500, 9800),
  ('حديد', '⛏️', 120, 135, -2.1, 5400, 7200),
  ('ذهب', '🥇', 850, 920, 8.4, 1200, 1800),
  ('قمح', '🌾', 25, 22, -4.5, 28000, 22000),
  ('نفط', '🛢️', 200, 215, 3.8, 3200, 4100),
  ('ألماس', '💎', 2500, 2680, 12.3, 340, 520),
  ('قماش', '🧵', 35, 38, 1.2, 18000, 15000),
  ('حجر', '🪨', 15, 14, -1.8, 45000, 38000)
ON CONFLICT DO NOTHING;

-- Insert Market Offers
INSERT INTO market_offers (type, resource_name, quantity, price, country_name, seller) VALUES
  ('sell', 'خشب', 500, 50, 'نوفاريا', 'Player_X'),
  ('buy', 'حديد', 200, 130, 'أركاديا', 'IronLord'),
  ('sell', 'ذهب', 50, 900, 'سولاريا', 'GoldMiner'),
  ('buy', 'قمح', 1000, 20, 'فروستلاند', 'FarmKing'),
  ('sell', 'نفط', 100, 210, 'ثاندوريا', 'OilBaron'),
  ('sell', 'ألماس', 10, 2600, 'إيمريون', 'DiamondHands'),
  ('buy', 'خشب', 800, 48, 'أركاديا', 'BuilderPro'),
  ('sell', 'قماش', 300, 36, 'نوفاريا', 'TextileKing');

-- Insert Job Offers
INSERT INTO job_offers (title, company, country_name, salary, type) VALUES
  ('عامل مناجم', 'شركة التعدين المتحدة', 'نوفاريا', 450, 'دوام كامل'),
  ('مزارع', 'مزارع أركاديا', 'أركاديا', 320, 'دوام كامل'),
  ('تاجر', 'سوق الذهب الكبير', 'سولاريا', 680, 'حر'),
  ('مهندس بناء', 'بنّاءو فروستلاند', 'فروستلاند', 550, 'دوام كامل'),
  ('حارس غابة', 'حماية إيمريون', 'إيمريون', 380, 'جزئي'),
  ('عامل نفط', 'طاقة ثاندوريا', 'ثاندوريا', 720, 'دوام كامل');

-- Insert Treasury Entries
INSERT INTO treasury_entries (type, category, amount, description) VALUES
  ('income', 'ضرائب', 125000, 'إيرادات ضريبية شهرية'),
  ('income', 'رسوم تجارية', 45000, 'رسوم معاملات السوق'),
  ('expense', 'رواتب', 89000, 'رواتب الموظفين الحكوميين'),
  ('expense', 'بنية تحتية', 156000, 'بناء طرق جديدة'),
  ('income', 'موارد طبيعية', 78000, 'إيرادات استخراج الموارد'),
  ('expense', 'دفاع', 210000, 'تجهيزات عسكرية'),
  ('income', 'استثمارات', 34000, 'أرباح استثمارات خارجية');

-- Insert Revenue Data
INSERT INTO revenue_data (month_name, income, expense) VALUES
  ('يناير', 245000, 180000),
  ('فبراير', 268000, 195000),
  ('مارس', 290000, 210000),
  ('أبريل', 275000, 225000),
  ('مايو', 310000, 240000),
  ('يونيو', 335000, 255000);

-- Insert Price History
INSERT INTO price_history (resource_id, price, record_date) VALUES
  (1, 42, '2024-01-01'),
  (1, 45, '2024-02-01'),
  (1, 48, '2024-03-01'),
  (1, 44, '2024-04-01'),
  (1, 51, '2024-05-01'),
  (1, 55, '2024-06-01'),
  (1, 52, '2024-07-01'),
  (1, 58, '2024-08-01'),
  (1, 54, '2024-09-01'),
  (1, 60, '2024-10-01'),
  (1, 57, '2024-11-01'),
  (1, 52, '2024-12-01');

-- Insert Global Market Comparison
INSERT INTO global_market_comparison (resource_name, country_id, price) VALUES
  ('خشب', 1, 52), ('خشب', 2, 48), ('خشب', 3, 55), ('خشب', 4, 44), ('خشب', 5, 58), ('خشب', 6, 50),
  ('حديد', 1, 135), ('حديد', 2, 128), ('حديد', 3, 142), ('حديد', 4, 120), ('حديد', 5, 148), ('حديد', 6, 130),
  ('ذهب', 1, 920), ('ذهب', 2, 880), ('ذهب', 3, 950), ('ذهب', 4, 850), ('ذهب', 5, 980), ('ذهب', 6, 900),
  ('قمح', 1, 22), ('قمح', 2, 20), ('قمح', 3, 25), ('قمح', 4, 18), ('قمح', 5, 28), ('قمح', 6, 23),
  ('نفط', 1, 215), ('نفط', 2, 200), ('نفط', 3, 225), ('نفط', 4, 190), ('نفط', 5, 235), ('نفط', 6, 210);

-- Insert Owner User (Admin)
INSERT INTO users (game_id, username, country_id, role, serial, status)
VALUES ('10005', 'مالك_إيمريون', 5, 'owner', 'G3H4-I5J6-K7L8-M9N0', 'active')
ON CONFLICT (game_id) DO NOTHING;

-- Insert Demo Users
INSERT INTO users (game_id, username, country_id, role, serial, status) VALUES
  ('10001', 'أحمد_نوفاريا', 1, 'member', 'A1B2-C3D4-E5F6-G7H8', 'active'),
  ('10002', 'سارة_أركاديا', 2, 'member', 'I9J0-K1L2-M3N4-O5P6', 'active'),
  ('10003', 'خالد_سولاريا', 3, 'member', 'Q7R8-S9T0-U1V2-W3X4', 'pending'),
  ('10004', 'نور_فروستلاند', 4, 'member', 'Y5Z6-A7B8-C9D0-E1F2', 'suspended')
ON CONFLICT (game_id) DO NOTHING;

-- Insert Activation Codes
INSERT INTO activation_codes (code, duration, status) VALUES
  ('ECLE-2024-ABCD-1234', '30 يوم', 'used'),
  ('ECLE-2024-EFGH-5678', 'مفتوح', 'available'),
  ('ECLE-2024-IJKL-9012', '7 أيام', 'expired');

-- ============================================
-- Enable Row Level Security
-- ============================================
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasury_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_market_comparison ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_data ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Create Policies (Allow all for anon for now)
-- ============================================
CREATE POLICY "Allow select for all" ON countries FOR SELECT USING (true);
CREATE POLICY "Allow select for all" ON users FOR SELECT USING (true);
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow select for all" ON resources FOR SELECT USING (true);
CREATE POLICY "Allow all for resources" ON resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow select for all" ON market_offers FOR SELECT USING (true);
CREATE POLICY "Allow all for market_offers" ON market_offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow select for all" ON job_offers FOR SELECT USING (true);
CREATE POLICY "Allow all for job_offers" ON job_offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow select for all" ON treasury_entries FOR SELECT USING (true);
CREATE POLICY "Allow all for treasury_entries" ON treasury_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow select for all" ON price_history FOR SELECT USING (true);
CREATE POLICY "Allow all for price_history" ON price_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow select for all" ON activation_codes FOR SELECT USING (true);
CREATE POLICY "Allow all for activation_codes" ON activation_codes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow select for all" ON global_market_comparison FOR SELECT USING (true);
CREATE POLICY "Allow all for global_market_comparison" ON global_market_comparison FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow select for all" ON revenue_data FOR SELECT USING (true);
CREATE POLICY "Allow all for revenue_data" ON revenue_data FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- Create updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
