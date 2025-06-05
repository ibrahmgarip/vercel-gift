-- Simple script to create just the materialized view for top selling products
-- This assumes the basic columns already exist

-- First ensure we have the required columns with default values
UPDATE gifts SET 
  sales_count = COALESCE(sales_count, 0),
  click_count = COALESCE(click_count, 0),
  popularity_score = COALESCE(popularity_score, total_score)
WHERE sales_count IS NULL OR click_count IS NULL OR popularity_score IS NULL;

-- Create the calculate_popularity_score function if it doesn't exist
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
  age_factor := GREATEST(0.1, 1.0 - (EXTRACT(EPOCH FROM NOW() - p_created_at) / (86400 * 365)));
  
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

-- Update popularity scores
UPDATE gifts 
SET popularity_score = calculate_popularity_score(
  total_score, 
  COALESCE(sales_count, 0), 
  COALESCE(click_count, 0), 
  created_at
);

-- Drop and recreate the materialized view
DROP MATERIALIZED VIEW IF EXISTS top_selling_by_category;

CREATE MATERIALIZED VIEW top_selling_by_category AS
WITH category_mapping AS (
  SELECT 
    g.id,
    g.title,
    g.image_url,
    g.price_range,
    g.total_score,
    COALESCE(g.sales_count, 0) as sales_count,
    COALESCE(g.click_count, 0) as click_count,
    COALESCE(g.popularity_score, g.total_score) as popularity_score,
    g.created_at,
    -- Map to categories
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
      WHEN g.recipient = 'Erkek Arkadaş' THEN 'erkek-arkadas'
      WHEN g.recipient = 'Kız Arkadaş' THEN 'kiz-arkadas'
      WHEN g.recipient = 'Çocuk' THEN 'cocuklar-icin'
      WHEN g.occasion = 'Anneler Günü' OR g.recipient = 'Anne' THEN 'anneler-gunu'
      WHEN g.occasion = 'Babalar Günü' OR g.recipient = 'Baba' THEN 'babalar-gunu'
      WHEN g.occasion = 'Sevgililer Günü' THEN 'sevgililer-gunu'
      WHEN g.occasion IN ('Yeni İş', 'Terfi') THEN 'yeni-is-kutlamasi'
      WHEN g.occasion = 'Mezuniyet' THEN 'mezuniyet'
      WHEN g.occasion = 'Yıldönümü' THEN 'yildonumu'
      WHEN g.occasion = 'Kendine Hediye' THEN 'kendine-hediye'
      ELSE 'genel'
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
  WHERE category_id != 'genel'
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
WHERE rank_in_category <= 10;

-- Create index on the materialized view
CREATE INDEX IF NOT EXISTS idx_top_selling_category ON top_selling_by_category(category_id, rank_in_category);

-- Show results
SELECT 
  'Materialized view created successfully!' as status,
  COUNT(*) as total_entries,
  COUNT(DISTINCT category_id) as categories
FROM top_selling_by_category;
