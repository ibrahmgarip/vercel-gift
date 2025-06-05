-- This script ensures all required columns exist in the gifts table
-- and creates the top_selling_by_category view if it doesn't exist
-- This version safely handles existing policies

-- First, check if the columns exist and add them if they don't
DO $$
BEGIN
    -- Add sales_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'gifts' AND column_name = 'sales_count') THEN
        ALTER TABLE gifts ADD COLUMN sales_count INTEGER DEFAULT 0;
    END IF;

    -- Add click_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'gifts' AND column_name = 'click_count') THEN
        ALTER TABLE gifts ADD COLUMN click_count INTEGER DEFAULT 0;
    END IF;

    -- Add last_sale_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'gifts' AND column_name = 'last_sale_date') THEN
        ALTER TABLE gifts ADD COLUMN last_sale_date TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add popularity_score column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'gifts' AND column_name = 'popularity_score') THEN
        ALTER TABLE gifts ADD COLUMN popularity_score DECIMAL(10,2) DEFAULT 0;
    END IF;
END $$;

-- Create gift_sales table if it doesn't exist
CREATE TABLE IF NOT EXISTS gift_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_id UUID REFERENCES gifts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  marketplace_name TEXT,
  sale_amount DECIMAL(10,2),
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gift_clicks table if it doesn't exist
CREATE TABLE IF NOT EXISTS gift_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_id UUID REFERENCES gifts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  click_type TEXT CHECK (click_type IN ('view', 'affiliate_click', 'share')) NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to calculate popularity score if it doesn't exist
CREATE OR REPLACE FUNCTION calculate_popularity_score(
  p_total_score INTEGER,
  p_sales_count INTEGER,
  p_click_count INTEGER,
  p_created_at TIMESTAMP WITH TIME ZONE
) RETURNS DECIMAL(10,2) AS $$
DECLARE
  age_factor DECIMAL(10,2);
  popularity DECIMAL(10,2);
BEGIN
  -- Handle NULL values
  p_total_score := COALESCE(p_total_score, 0);
  p_sales_count := COALESCE(p_sales_count, 0);
  p_click_count := COALESCE(p_click_count, 0);
  
  -- Calculate age factor (newer products get slight boost)
  age_factor := GREATEST(0.1, 1.0 - (EXTRACT(EPOCH FROM NOW() - p_created_at) / (86400 * 365))); -- 1 year decay
  
  -- Calculate popularity score
  popularity := (
    (p_total_score * 1.0) +           -- Vote score weight: 1x
    (p_sales_count * 5.0) +           -- Sales weight: 5x
    (p_click_count * 0.1) +           -- Click weight: 0.1x
    (age_factor * 2.0)                -- Recency boost: 2x
  );
  
  RETURN popularity;
END;
$$ LANGUAGE plpgsql;

-- Update popularity scores for all gifts
UPDATE gifts 
SET popularity_score = calculate_popularity_score(
  total_score, 
  COALESCE(sales_count, 0), 
  COALESCE(click_count, 0), 
  created_at
);

-- Create or replace the materialized view
DROP MATERIALIZED VIEW IF EXISTS top_selling_by_category;
CREATE MATERIALIZED VIEW top_selling_by_category AS
WITH category_mapping AS (
  -- Map gifts to categories based on interests, recipients, and occasions
  SELECT 
    g.id,
    g.title,
    g.image_url,
    g.price_range,
    g.total_score,
    COALESCE(g.sales_count, 0) as sales_count,
    COALESCE(g.click_count, 0) as click_count,
    COALESCE(g.popularity_score, 0) as popularity_score,
    g.created_at,
    -- Interest-based categories
    CASE 
      WHEN 'Teknoloji' = ANY(g.interests) THEN 'teknoloji'
      WHEN 'Sağlık & Wellness' = ANY(g.interests) THEN 'saglik-wellness'
      WHEN 'Müzik' = ANY(g.interests) THEN 'muzik'
      WHEN 'Oyun' = ANY(g.interests) THEN 'oyun'
      WHEN 'Ev' = ANY(g.interests) THEN 'ev-yasam'
      WHEN 'Moda' = ANY(g.interests) THEN 'moda'
      WHEN 'Kitap' = ANY(g.interests) OR 'Kültür' = ANY(g.interests) THEN 'kitap-kultur'
      WHEN 'Yiyecek & İçecek' = ANY(g.interests) THEN 'yiyecek-icecek'
      WHEN 'Spor' = ANY(g.interests) OR 'Fitness' = ANY(g.interests) THEN 'spor-fitness'
      WHEN 'Fotoğrafçılık' = ANY(g.interests) OR 'Sanat' = ANY(g.interests) THEN 'fotograf'
      -- Recipient-based categories
      WHEN g.recipient = 'Erkek Arkadaş' THEN 'erkek-arkadas'
      WHEN g.recipient = 'Kız Arkadaş' THEN 'kiz-arkadas'
      WHEN g.recipient = 'Çocuk' THEN 'cocuklar-icin'
      -- Occasion-based categories
      WHEN g.occasion = 'Anneler Günü' OR g.recipient = 'Anne' THEN 'anneler-gunu'
      WHEN g.occasion = 'Babalar Günü' OR g.recipient = 'Baba' THEN 'babalar-gunu'
      WHEN g.occasion = 'Sevgililer Günü' THEN 'sevgililer-gunu'
      WHEN g.occasion IN ('Yeni İş', 'Terfi') THEN 'yeni-is-kutlamasi'
      WHEN g.occasion = 'Mezuniyet' THEN 'mezuniyet'
      WHEN g.occasion = 'Yıldönümü' THEN 'yildonumu'
      WHEN g.occasion = 'Kendine Hediye' THEN 'kendine-hediye'
      ELSE 'diger'
    END as category_id
  FROM gifts g
),
ranked_products AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (
      PARTITION BY category_id 
      ORDER BY 
        popularity_score DESC, 
        sales_count DESC, 
        total_score DESC, 
        click_count DESC,
        created_at ASC
    ) as rank_in_category
  FROM category_mapping
  WHERE category_id != 'diger'
)
SELECT 
  category_id,
  id as gift_id,
  title,
  image_url,
  price_range,
  total_score,
  sales_count,
  click_count,
  popularity_score,
  rank_in_category
FROM ranked_products
WHERE rank_in_category <= 10; -- Top 10 per category

-- Create indexes for performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_gift_sales_gift_id ON gift_sales(gift_id);
CREATE INDEX IF NOT EXISTS idx_gift_sales_date ON gift_sales(sale_date DESC);
CREATE INDEX IF NOT EXISTS idx_gift_clicks_gift_id ON gift_clicks(gift_id);
CREATE INDEX IF NOT EXISTS idx_gift_clicks_date ON gift_clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_gifts_popularity ON gifts(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_gifts_sales_count ON gifts(sales_count DESC);

-- Enable Row Level Security for new tables (only if not already enabled)
DO $$
BEGIN
    -- Enable RLS for gift_sales if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'gift_sales' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE gift_sales ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Enable RLS for gift_clicks if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'gift_clicks' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE gift_clicks ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Sales data is viewable by everyone" ON gift_sales;
DROP POLICY IF EXISTS "Click data is viewable by everyone" ON gift_clicks;
DROP POLICY IF EXISTS "Authenticated users can track sales" ON gift_sales;
DROP POLICY IF EXISTS "Authenticated users can track clicks" ON gift_clicks;

-- Create policies for new tables
CREATE POLICY "Sales data is viewable by everyone" ON gift_sales FOR SELECT USING (true);
CREATE POLICY "Click data is viewable by everyone" ON gift_clicks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can track sales" ON gift_sales FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can track clicks" ON gift_clicks FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Add some sample click data if tables are empty (only if no data exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM gift_clicks LIMIT 1) THEN
        INSERT INTO gift_clicks (gift_id, click_type, clicked_at)
        SELECT 
          id,
          'view',
          NOW() - (random() * interval '7 days')
        FROM gifts
        LIMIT 50; -- Add clicks for first 50 gifts
    END IF;
END $$;

-- Update click counts from actual data
UPDATE gifts 
SET click_count = (
  SELECT COUNT(*) 
  FROM gift_clicks 
  WHERE gift_clicks.gift_id = gifts.id
)
WHERE EXISTS (SELECT 1 FROM gift_clicks WHERE gift_clicks.gift_id = gifts.id);

-- Update sales counts from actual data (if any sales exist)
UPDATE gifts 
SET sales_count = (
  SELECT COUNT(*) 
  FROM gift_sales 
  WHERE gift_sales.gift_id = gifts.id
)
WHERE EXISTS (SELECT 1 FROM gift_sales WHERE gift_sales.gift_id = gifts.id);

-- Update popularity scores again with the new data
UPDATE gifts 
SET popularity_score = calculate_popularity_score(
  total_score, 
  COALESCE(sales_count, 0), 
  COALESCE(click_count, 0), 
  created_at
);

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW top_selling_by_category;

-- Show completion message
SELECT 
  'Database schema updated successfully!' as status,
  COUNT(*) as total_gifts,
  COUNT(*) FILTER (WHERE popularity_score > 0) as gifts_with_popularity,
  (SELECT COUNT(*) FROM top_selling_by_category) as top_selling_entries
FROM gifts;
