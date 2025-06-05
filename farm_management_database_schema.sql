-- Farm Management System Database Schema
-- This creates all the tables needed for your farm management application with user isolation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Profiles Table (already in the base setup)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'Farm Owner',
    location TEXT,
    phone_number TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Egg Records Table
CREATE TABLE IF NOT EXISTS egg_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    date DATE NOT NULL,
    total_eggs INTEGER NOT NULL DEFAULT 0,
    pickup_time TIME,
    pickup_method TEXT,
    egg_type TEXT,
    for_incubation INTEGER DEFAULT 0,
    broken_damaged INTEGER DEFAULT 0,
    weather_conditions TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Incubation Batches Table
CREATE TABLE IF NOT EXISTS incubation_batches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    batch_name TEXT NOT NULL,
    species TEXT NOT NULL,
    varieties TEXT,
    egg_count INTEGER NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    temperature_f DECIMAL(4,1) DEFAULT 99.5,
    humidity_percent INTEGER DEFAULT 55,
    notes TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Feed Purchases Table
CREATE TABLE IF NOT EXISTS feed_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    purchase_date DATE NOT NULL,
    feed_type TEXT NOT NULL,
    brand_type TEXT,
    quantity_lbs DECIMAL(8,2) NOT NULL,
    total_cost_dollars DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Feed Usage Table
CREATE TABLE IF NOT EXISTS feed_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    usage_date DATE NOT NULL,
    feed_type TEXT NOT NULL,
    quantity_lbs DECIMAL(8,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT,
    phone_number TEXT,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Sales Table
CREATE TABLE IF NOT EXISTS sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    customer_id UUID REFERENCES customers(id),
    sale_date DATE NOT NULL,
    egg_production_type TEXT,
    dozens INTEGER NOT NULL DEFAULT 0,
    price_per_dozen DECIMAL(6,2) NOT NULL,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (dozens * price_per_dozen) STORED,
    payment_method TEXT DEFAULT 'Cash',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE incubation_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS Policies for egg_records table
CREATE POLICY "Users can view own egg records" ON egg_records
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own egg records" ON egg_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own egg records" ON egg_records
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own egg records" ON egg_records
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for incubation_batches table
CREATE POLICY "Users can view own incubation batches" ON incubation_batches
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own incubation batches" ON incubation_batches
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own incubation batches" ON incubation_batches
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own incubation batches" ON incubation_batches
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for feed_purchases table
CREATE POLICY "Users can view own feed purchases" ON feed_purchases
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own feed purchases" ON feed_purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own feed purchases" ON feed_purchases
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own feed purchases" ON feed_purchases
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for feed_usage table
CREATE POLICY "Users can view own feed usage" ON feed_usage
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own feed usage" ON feed_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own feed usage" ON feed_usage
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own feed usage" ON feed_usage
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for customers table
CREATE POLICY "Users can view own customers" ON customers
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own customers" ON customers
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own customers" ON customers
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own customers" ON customers
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for sales table
CREATE POLICY "Users can view own sales" ON sales
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sales" ON sales
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sales" ON sales
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sales" ON sales
    FOR DELETE USING (auth.uid() = user_id);

-- Create functions to automatically set user_id
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to automatically set user_id on insert
CREATE TRIGGER set_user_id_egg_records
    BEFORE INSERT ON egg_records
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_user_id_incubation_batches
    BEFORE INSERT ON incubation_batches
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_user_id_feed_purchases
    BEFORE INSERT ON feed_purchases
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_user_id_feed_usage
    BEFORE INSERT ON feed_usage
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_user_id_customers
    BEFORE INSERT ON customers
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_user_id_sales
    BEFORE INSERT ON sales
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id();

-- Function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_egg_records_user_id ON egg_records(user_id);
CREATE INDEX IF NOT EXISTS idx_egg_records_date ON egg_records(date);
CREATE INDEX IF NOT EXISTS idx_incubation_batches_user_id ON incubation_batches(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_purchases_user_id ON feed_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_usage_user_id ON feed_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Revoke public access and only allow authenticated users
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Create some helpful views for reporting
CREATE OR REPLACE VIEW user_sales_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', sale_date) as month,
    SUM(dozens) as total_dozens_sold,
    SUM(total_amount) as total_revenue,
    COUNT(*) as number_of_sales
FROM sales
WHERE user_id = auth.uid()
GROUP BY user_id, DATE_TRUNC('month', sale_date)
ORDER BY month DESC;

CREATE OR REPLACE VIEW user_egg_production_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', date) as month,
    SUM(total_eggs) as total_eggs_collected,
    AVG(total_eggs) as avg_daily_eggs,
    SUM(for_incubation) as eggs_for_incubation,
    SUM(broken_damaged) as broken_damaged_eggs
FROM egg_records
WHERE user_id = auth.uid()
GROUP BY user_id, DATE_TRUNC('month', date)
ORDER BY month DESC;

-- Enable RLS on views
ALTER VIEW user_sales_summary SET (security_barrier = true);
ALTER VIEW user_egg_production_summary SET (security_barrier = true);
