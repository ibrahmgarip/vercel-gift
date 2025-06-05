-- Add sales tracking and top-selling product identification

-- Add sales tracking columns to gifts table
ALTER TABLE gifts ADD COLUMN IF NOT EXISTS sales_count INTEGER DEFAULT 0;
ALTER TABLE gifts ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;
ALTER TABLE gifts ADD COLUMN IF NOT EXISTS last_sale_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE gifts ADD COLUMN IF NOT EXISTS popularity_score DECIMAL(10,2) DEFAULT 0;

-- Create sales tracking table
CREATE TABLE IF NOT EXISTS gift_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_id UUID REFERENCES gifts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  marketplace_name TEXT,
  sale_amount DECIMAL(10,2),
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create click tracking table
CREATE TABLE IF NOT EXISTS gift_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_id UUID REFERENCES gifts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  click_type TEXT CHECK (click_type IN ('view', 'affiliate_click', 'share')) NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create materialized view for top-selling products by category
CREATE MATERIALIZED VIEW IF NOT EXISTS top_selling_by_category AS
WITH category_mapping AS (
  -- Map gifts to categories based on interests, recipients, and occasions
  SELECT 
    g.id,
    g.title,
    g.image_url,
    g.price_range,
    g.total_score,
    g.sales_count,
    g.click_count,
    g.popularity_score,
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gift_sales_gift_id ON gift_sales(gift_id);
CREATE INDEX IF NOT EXISTS idx_gift_sales_date ON gift_sales(sale_date DESC);
CREATE INDEX IF NOT EXISTS idx_gift_clicks_gift_id ON gift_clicks(gift_id);
CREATE INDEX IF NOT EXISTS idx_gift_clicks_date ON gift_clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_gifts_popularity ON gifts(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_gifts_sales_count ON gifts(sales_count DESC);

-- Function to calculate popularity score
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

-- Function to update popularity scores
CREATE OR REPLACE FUNCTION update_popularity_scores() RETURNS void AS $$
BEGIN
  UPDATE gifts 
  SET popularity_score = calculate_popularity_score(
    total_score, 
    sales_count, 
    click_count, 
    created_at
  );
  
  -- Refresh the materialized view
  REFRESH MATERIALIZED VIEW top_selling_by_category;
END;
$$ LANGUAGE plpgsql;

-- Add some sample sales data to existing products
INSERT INTO gift_sales (gift_id, marketplace_name, sale_amount, sale_date) 
SELECT 
  id,
  CASE (random() * 4)::int
    WHEN 0 THEN 'Amazon'
    WHEN 1 THEN 'Trendyol'
    WHEN 2 THEN 'Hepsiburada'
    ELSE 'MediaMarkt'
  END,
  (random() * 1000 + 100)::decimal(10,2),
  NOW() - (random() * interval '30 days')
FROM gifts 
WHERE random() < 0.7; -- 70% of products have sales

-- Update sales counts based on sales data
UPDATE gifts 
SET sales_count = (
  SELECT COUNT(*) 
  FROM gift_sales 
  WHERE gift_sales.gift_id = gifts.id
);

-- Add some sample click data
INSERT INTO gift_clicks (gift_id, click_type, clicked_at)
SELECT 
  id,
  CASE (random() * 3)::int
    WHEN 0 THEN 'view'
    WHEN 1 THEN 'affiliate_click'
    ELSE 'share'
  END,
  NOW() - (random() * interval '7 days')
FROM gifts,
generate_series(1, (random() * 20 + 5)::int); -- 5-25 clicks per product

-- Update click counts
UPDATE gifts 
SET click_count = (
  SELECT COUNT(*) 
  FROM gift_clicks 
  WHERE gift_clicks.gift_id = gifts.id
);

-- Calculate initial popularity scores
SELECT update_popularity_scores();

-- Enable Row Level Security for new tables
ALTER TABLE gift_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
CREATE POLICY "Sales data is viewable by everyone" ON gift_sales FOR SELECT USING (true);
CREATE POLICY "Click data is viewable by everyone" ON gift_clicks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can track sales" ON gift_sales FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can track clicks" ON gift_clicks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
