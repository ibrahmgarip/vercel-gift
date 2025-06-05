CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_id UUID REFERENCES gifts(id) ON DELETE CASCADE,
  marketplace_name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT '₺',
  affiliate_url TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT TRUE,
  shipping_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_gift_id ON marketplace_listings(gift_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_price ON marketplace_listings(price);

-- Enable Row Level Security
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Marketplace listings are viewable by everyone" ON marketplace_listings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create marketplace listings" ON marketplace_listings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Add sample marketplace listings for existing gifts
-- Akıllı Bileklik
INSERT INTO marketplace_listings (gift_id, marketplace_name, price, currency, affiliate_url, shipping_info) VALUES
((SELECT id FROM gifts WHERE title = 'Akıllı Bileklik' LIMIT 1), 'Amazon', 599.99, '₺', 'https://amazon.com.tr/akilli-bileklik', 'Ücretsiz kargo, 2-3 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Akıllı Bileklik' LIMIT 1), 'Trendyol', 649.90, '₺', 'https://trendyol.com/akilli-bileklik', 'Ücretsiz kargo, 1-2 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Akıllı Bileklik' LIMIT 1), 'Hepsiburada', 579.00, '₺', 'https://hepsiburada.com/akilli-bileklik', '30₺ kargo ücreti, 2-4 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Akıllı Bileklik' LIMIT 1), 'MediaMarkt', 699.00, '₺', 'https://mediamarkt.com.tr/akilli-bileklik', 'Ücretsiz kargo, mağazadan teslim seçeneği');

-- El Yapımı Deri Cüzdan
INSERT INTO marketplace_listings (gift_id, marketplace_name, price, currency, affiliate_url, shipping_info) VALUES
((SELECT id FROM gifts WHERE title = 'El Yapımı Deri Cüzdan' LIMIT 1), 'Etsy', 349.90, '₺', 'https://etsy.com/tr/deri-cuzdan', '50₺ kargo ücreti, 5-7 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'El Yapımı Deri Cüzdan' LIMIT 1), 'n11', 299.00, '₺', 'https://n11.com/deri-cuzdan', 'Ücretsiz kargo, 3-5 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'El Yapımı Deri Cüzdan' LIMIT 1), 'Trendyol', 329.99, '₺', 'https://trendyol.com/deri-cuzdan', 'Ücretsiz kargo, 2-3 gün içinde teslimat');

-- Türk Kahvesi Seti
INSERT INTO marketplace_listings (gift_id, marketplace_name, price, currency, affiliate_url, shipping_info) VALUES
((SELECT id FROM gifts WHERE title = 'Türk Kahvesi Seti' LIMIT 1), 'Hepsiburada', 249.90, '₺', 'https://hepsiburada.com/turk-kahvesi-seti', 'Ücretsiz kargo, 1-3 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Türk Kahvesi Seti' LIMIT 1), 'Çiçek Sepeti', 279.00, '₺', 'https://ciceksepeti.com/turk-kahvesi-seti', 'Ücretsiz kargo, aynı gün teslimat seçeneği'),
((SELECT id FROM gifts WHERE title = 'Türk Kahvesi Seti' LIMIT 1), 'Amazon', 229.99, '₺', 'https://amazon.com.tr/turk-kahvesi-seti', 'Ücretsiz kargo, 2-3 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Türk Kahvesi Seti' LIMIT 1), 'Karaca', 299.90, '₺', 'https://karaca.com/turk-kahvesi-seti', 'Ücretsiz kargo, 2-4 gün içinde teslimat');

-- Kişiselleştirilmiş Yıldız Haritası
INSERT INTO marketplace_listings (gift_id, marketplace_name, price, currency, affiliate_url, shipping_info) VALUES
((SELECT id FROM gifts WHERE title = 'Kişiselleştirilmiş Yıldız Haritası' LIMIT 1), 'Etsy', 199.90, '₺', 'https://etsy.com/tr/yildiz-haritasi', '30₺ kargo ücreti, 3-5 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Kişiselleştirilmiş Yıldız Haritası' LIMIT 1), 'Çiçek Sepeti', 179.00, '₺', 'https://ciceksepeti.com/yildiz-haritasi', 'Ücretsiz kargo, 2-4 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Kişiselleştirilmiş Yıldız Haritası' LIMIT 1), 'Trendyol', 189.99, '₺', 'https://trendyol.com/yildiz-haritasi', 'Ücretsiz kargo, 2-3 gün içinde teslimat');

-- Akıllı Ev Asistanı
INSERT INTO marketplace_listings (gift_id, marketplace_name, price, currency, affiliate_url, shipping_info) VALUES
((SELECT id FROM gifts WHERE title = 'Akıllı Ev Asistanı' LIMIT 1), 'Amazon', 1299.90, '₺', 'https://amazon.com.tr/akilli-ev-asistani', 'Ücretsiz kargo, 1-2 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Akıllı Ev Asistanı' LIMIT 1), 'MediaMarkt', 1349.00, '₺', 'https://mediamarkt.com.tr/akilli-ev-asistani', 'Ücretsiz kargo, mağazadan teslim seçeneği'),
((SELECT id FROM gifts WHERE title = 'Akıllı Ev Asistanı' LIMIT 1), 'Teknosa', 1299.00, '₺', 'https://teknosa.com/akilli-ev-asistani', 'Ücretsiz kargo, 2-3 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Akıllı Ev Asistanı' LIMIT 1), 'Hepsiburada', 1249.99, '₺', 'https://hepsiburada.com/akilli-ev-asistani', 'Ücretsiz kargo, 1-3 gün içinde teslimat');

-- Add listings for a few more gifts
-- Aromatik Mum Seti
INSERT INTO marketplace_listings (gift_id, marketplace_name, price, currency, affiliate_url, shipping_info) VALUES
((SELECT id FROM gifts WHERE title = 'Aromatik Mum Seti' LIMIT 1), 'Trendyol', 149.90, '₺', 'https://trendyol.com/aromatik-mum-seti', 'Ücretsiz kargo, 2-3 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Aromatik Mum Seti' LIMIT 1), 'Çiçek Sepeti', 169.00, '₺', 'https://ciceksepeti.com/aromatik-mum-seti', 'Ücretsiz kargo, aynı gün teslimat seçeneği'),
((SELECT id FROM gifts WHERE title = 'Aromatik Mum Seti' LIMIT 1), 'Watsons', 129.99, '₺', 'https://watsons.com.tr/aromatik-mum-seti', '20₺ kargo ücreti, 2-4 gün içinde teslimat');

-- Vintage Vinil Pikap
INSERT INTO marketplace_listings (gift_id, marketplace_name, price, currency, affiliate_url, shipping_info) VALUES
((SELECT id FROM gifts WHERE title = 'Vintage Vinil Pikap' LIMIT 1), 'Hepsiburada', 1499.90, '₺', 'https://hepsiburada.com/vintage-vinil-pikap', 'Ücretsiz kargo, 2-4 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Vintage Vinil Pikap' LIMIT 1), 'Amazon', 1599.00, '₺', 'https://amazon.com.tr/vintage-vinil-pikap', 'Ücretsiz kargo, 2-3 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Vintage Vinil Pikap' LIMIT 1), 'MediaMarkt', 1449.99, '₺', 'https://mediamarkt.com.tr/vintage-vinil-pikap', 'Ücretsiz kargo, mağazadan teslim seçeneği');

-- Wireless Kulaklık
INSERT INTO marketplace_listings (gift_id, marketplace_name, price, currency, affiliate_url, shipping_info) VALUES
((SELECT id FROM gifts WHERE title = 'Wireless Kulaklık' LIMIT 1), 'Amazon', 899.90, '₺', 'https://amazon.com.tr/wireless-kulaklik', 'Ücretsiz kargo, 1-2 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Wireless Kulaklık' LIMIT 1), 'MediaMarkt', 949.00, '₺', 'https://mediamarkt.com.tr/wireless-kulaklik', 'Ücretsiz kargo, mağazadan teslim seçeneği'),
((SELECT id FROM gifts WHERE title = 'Wireless Kulaklık' LIMIT 1), 'Teknosa', 929.99, '₺', 'https://teknosa.com/wireless-kulaklik', 'Ücretsiz kargo, 2-3 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Wireless Kulaklık' LIMIT 1), 'Trendyol', 879.00, '₺', 'https://trendyol.com/wireless-kulaklik', 'Ücretsiz kargo, 1-3 gün içinde teslimat'),
((SELECT id FROM gifts WHERE title = 'Wireless Kulaklık' LIMIT 1), 'Hepsiburada', 899.00, '₺', 'https://hepsiburada.com/wireless-kulaklik', 'Ücretsiz kargo, 2-4 gün içinde teslimat');
