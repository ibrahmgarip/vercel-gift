-- Update existing gifts with real product images
UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop' WHERE title = 'Akıllı Bileklik';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' WHERE title = 'El Yapımı Deri Cüzdan';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop' WHERE title = 'Türk Kahvesi Seti';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=400&fit=crop' WHERE title = 'Kişiselleştirilmiş Yıldız Haritası';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' WHERE title = 'Akıllı Ev Asistanı';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1602874801006-e26c884e8e4e?w=400&h=400&fit=crop' WHERE title = 'Aromatik Mum Seti';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop' WHERE title = 'Vintage Vinil Pikap';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop' WHERE title = 'Sukulent Bahçe Seti';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop' WHERE title = 'Bluetooth Hoparlör';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop' WHERE title = 'Yoga Matı ve Aksesuar Seti';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&h=400&fit=crop' WHERE title = 'Kahve Değirmeni';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop' WHERE title = 'Çay Seti';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop' WHERE title = 'Akıllı Saat';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop' WHERE title = 'El Yapımı Sabun Seti';

UPDATE gifts SET image_url = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop' WHERE title = 'Kitap Seti - Türk Klasikleri';

-- Add some additional gifts with images
INSERT INTO gifts (title, description, image_url, price_range, affiliate_url, occasion, recipient, interests, submitted_by, upvotes, total_score) VALUES
('Kişiselleştirilmiş Fotoğraf Albümü', 'El yapımı, kişiselleştirilmiş fotoğraf albümü. Özel anıları saklamak için romantik bir hediye.', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', '₺150-300', 'https://etsy.com/tr/fotograf-albumu', 'Yıldönümü', 'Romantik Partner', ARRAY['Kişiselleştirilmiş', 'Anı'], NULL, 25, 25),

('Bambu Mutfak Gereçleri Seti', 'Sürdürülebilir bambu malzemeden yapılmış mutfak gereçleri seti. Çevre dostu ve şık bir hediye.', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', '₺200-350', 'https://trendyol.com/bambu-mutfak-seti', 'Ev Hediyesi', 'Yemek Sever', ARRAY['Ev', 'Sürdürülebilir'], NULL, 19, 19),

('Wireless Kulaklık', 'Gürültü önleyici özellikli kablosuz kulaklık. Müzik ve podcast dinlemek için mükemmel ses kalitesi.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', '₺800-1500', 'https://amazon.com.tr/wireless-kulaklik', 'Doğum Günü', 'Müzik Sever', ARRAY['Teknoloji', 'Müzik'], NULL, 31, 31),

('Teraryum Seti', 'Kendi mini bahçenizi yaratın! Cam kap, toprak, bitkiler ve dekoratif taşlar içeren komple teraryum seti.', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop', '₺150-250', 'https://ciceksepeti.com/teraryum-seti', 'Teşekkür', 'Bitki Sever', ARRAY['Bahçecilik', 'DIY'], NULL, 22, 22),

('Aromaterapi Difüzör', 'Ultrasonik aromaterapi difüzörü, LED ışık özellikli. Rahatlatıcı bir atmosfer yaratmak için ideal.', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', '₺300-500', 'https://hepsiburada.com/aromaterapi-difuzor', 'Kendine Hediye', 'Herkes', ARRAY['Sağlık & Wellness', 'Ev'], NULL, 18, 18),

('Vintage Kamera', 'Retro tarzı instant kamera. Anıları hemen basılı fotoğraf olarak yakalayın. Nostaljik bir hediye.', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop', '₺600-1000', 'https://mediamarkt.com.tr/vintage-kamera', 'Doğum Günü', 'Fotoğraf Meraklısı', ARRAY['Fotoğrafçılık', 'Vintage'], NULL, 26, 26),

('Çikolata Yapım Seti', 'Evde çikolata yapımı için gerekli tüm malzemeler. Çikolata severlerin keyifle kullanacağı yaratıcı bir set.', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop', '₺200-400', 'https://migros.com.tr/cikolata-yapim-seti', 'Doğum Günü', 'Çikolata Sever', ARRAY['Yiyecek & İçecek', 'DIY'], NULL, 20, 20),

('Akıllı Bitki Saksısı', 'Otomatik sulama sistemi olan akıllı saksı. Bitkileriniz her zaman doğru miktarda su alır.', 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=400&fit=crop', '₺400-700', 'https://n11.com/akilli-bitki-saksisi', 'Ev Hediyesi', 'Teknoloji Meraklısı', ARRAY['Teknoloji', 'Bahçecilik'], NULL, 24, 24);
