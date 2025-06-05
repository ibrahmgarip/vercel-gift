-- Add gifts specifically for the new recipient and occasion categories

-- Erkek Arkadaş İçin (For Boyfriend)
INSERT INTO gifts (title, description, image_url, price_range, affiliate_url, occasion, recipient, interests, submitted_by, upvotes, total_score) VALUES
('Erkek Parfümü Seti', 'Kaliteli erkek parfümü ve after shave seti. Maskülen ve çekici kokular.', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', '₺300-600', 'https://sephora.com.tr/erkek-parfum-seti', 'Sevgililer Günü', 'Erkek Arkadaş', ARRAY['Moda', 'Kişisel Bakım'], NULL, 28, 28),

('Gaming Mouse Pad', 'RGB aydınlatmalı büyük gaming mouse pad. Oyuncu erkek arkadaşlar için ideal.', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', '₺200-400', 'https://gamegaraj.com/gaming-mousepad', 'Doğum Günü', 'Erkek Arkadaş', ARRAY['Oyun', 'Teknoloji'], NULL, 25, 25),

('Deri Cüzdan ve Kemer Seti', 'Şık deri cüzdan ve kemer kombinasyonu. İş hayatı için mükemmel.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', '₺400-800', 'https://derimod.com.tr/cuzdan-kemer-seti', 'Yıldönümü', 'Erkek Arkadaş', ARRAY['Moda', 'İş'], NULL, 22, 22),

-- Kız Arkadaş İçin (For Girlfriend)
('Takı Kutusu', 'El yapımı ahşap takı kutusu, kadife iç döşeme. Takıları düzenli saklamak için ideal.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop', '₺200-400', 'https://etsy.com/tr/taki-kutusu', 'Sevgililer Günü', 'Kız Arkadaş', ARRAY['Moda', 'Kişiselleştirilmiş'], NULL, 30, 30),

('Spa Hediye Seti', 'Banyo bombası, vücut kremi ve aromaterapi yağları içeren lüks spa seti.', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', '₺300-500', 'https://loccitane.com.tr/spa-seti', 'Doğum Günü', 'Kız Arkadaş', ARRAY['Sağlık & Wellness', 'Güzellik'], NULL, 27, 27),

('Çiçek Aboneliği', 'Aylık taze çiçek teslimatı. Her ay farklı mevsim çiçekleri.', 'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=400&h=400&fit=crop', '₺200-400/ay', 'https://ciceksepeti.com/cicek-aboneligi', 'Yıldönümü', 'Kız Arkadaş', ARRAY['Romantik', 'Abonelik'], NULL, 32, 32),

-- Anneler Günü İçin
('Anne Çay Seti', 'Özel tasarım anne temalı çay fincanları ve çay çeşitleri seti.', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop', '₺150-300', 'https://karaca.com/anne-cay-seti', 'Anneler Günü', 'Anne', ARRAY['Yiyecek & İçecek', 'Özel Gün'], NULL, 35, 35),

('Masaj Yastığı', 'Elektrikli boyun ve sırt masaj yastığı. Annelerin rahatlması için ideal.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', '₺400-700', 'https://vatan.com.tr/masaj-yastigi', 'Anneler Günü', 'Anne', ARRAY['Sağlık & Wellness'], NULL, 29, 29),

('Kişiselleştirilmiş Fotoğraf Çerçevesi', 'Anne için özel mesajlı fotoğraf çerçevesi. Aile fotoğrafları için ideal.', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', '₺100-250', 'https://fotomac.com.tr/kisisel-cerceve', 'Anneler Günü', 'Anne', ARRAY['Kişiselleştirilmiş', 'Anı'], NULL, 26, 26),

-- Yeni İş Kutlaması İçin
('Ofis Masası Düzenleyici', 'Bambu ofis masası düzenleyici set. Kalem, telefon ve belge bölmeleri.', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', '₺200-350', 'https://ikea.com.tr/ofis-duzenleyici', 'Yeni İş', 'İş Arkadaşı', ARRAY['Ofis', 'Düzen'], NULL, 24, 24),

('Motivasyon Kitabı Seti', 'Başarı ve motivasyon konulu en iyi kitaplardan oluşan 5 kitaplık set.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', '₺250-400', 'https://idefix.com/motivasyon-kitaplari', 'Terfi', 'İş Arkadaşı', ARRAY['Kitap', 'Motivasyon'], NULL, 21, 21),

('Lüks Kalem Seti', 'Gravürlü isim yazılabilen lüks kalem seti. İş hayatı için prestijli hediye.', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', '₺300-600', 'https://cross.com.tr/lux-kalem-seti', 'Yeni İş', 'İş Arkadaşı', ARRAY['Ofis', 'Lüks'], NULL, 27, 27),

-- Babalar Günü İçin
('Baba Tişört Seti', 'Komik baba sözleri yazılı tişört seti. Baba ve çocuk kombinasyonu.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', '₺150-300', 'https://trendyol.com/baba-tisort-seti', 'Babalar Günü', 'Baba', ARRAY['Giyim', 'Komik'], NULL, 23, 23),

('Kahve Makinesi', 'Otomatik espresso kahve makinesi. Kahve seven babalar için mükemmel.', 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&h=400&fit=crop', '₺800-1500', 'https://delonghi.com.tr/kahve-makinesi', 'Babalar Günü', 'Baba', ARRAY['Yiyecek & İçecek', 'Ev'], NULL, 31, 31),

('Oto Aksesuar Seti', 'Araç için telefon tutucu, şarj aleti ve temizlik seti. Araba seven babalar için.', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop', '₺200-400', 'https://otokolay.com/oto-aksesuar-seti', 'Babalar Günü', 'Baba', ARRAY['Otomotiv', 'Teknoloji'], NULL, 19, 19),

-- Sevgililer Günü İçin
('Romantik Mum Seti', 'Kalp şeklinde kırmızı mumlar ve romantik kokular. Sevgililer günü atmosferi.', 'https://images.unsplash.com/photo-1602874801006-e26c884e8e4e?w=400&h=400&fit=crop', '₺150-300', 'https://madamecoco.com.tr/romantik-mum-seti', 'Sevgililer Günü', 'Romantik Partner', ARRAY['Romantik', 'Ev'], NULL, 33, 33),

('Çift Bileklik Seti', 'Eşleşen çift bileklikleri. İsim gravürü yapılabilir.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop', '₺200-400', 'https://altinbas.com/cift-bileklik', 'Sevgililer Günü', 'Romantik Partner', ARRAY['Takı', 'Çift'], NULL, 29, 29),

-- Mezuniyet İçin
('Laptop Çantası', 'Şık ve fonksiyonel laptop çantası. Üniversite mezunları için ideal.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', '₺300-600', 'https://samsonite.com.tr/laptop-cantasi', 'Mezuniyet', 'Öğrenci', ARRAY['Teknoloji', 'İş'], NULL, 25, 25),

('Başarı Plaket Seti', 'Kişiselleştirilmiş mezuniyet başarı plaketi ve fotoğraf çerçevesi.', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', '₺150-300', 'https://hediyedukkani.com/basari-plaketi', 'Mezuniyet', 'Öğrenci', ARRAY['Kişiselleştirilmiş', 'Başarı'], NULL, 22, 22),

-- Yıldönümü İçin
('Anı Defteri', 'Çiftler için özel anı defteri. Fotoğraf ve yazı eklenebilir.', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', '₺200-350', 'https://etsy.com/tr/ani-defteri', 'Yıldönümü', 'Eş', ARRAY['Romantik', 'Anı'], NULL, 28, 28),

('Çift Saati', 'Eşleşen çift kol saatleri. Yıldönümü tarihi gravürü yapılabilir.', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop', '₺600-1200', 'https://citizen.com.tr/cift-saati', 'Yıldönümü', 'Eş', ARRAY['Takı', 'Lüks'], NULL, 30, 30),

-- Çocuklar İçin
('Eğitici Oyun Seti', 'STEM eğitimi destekleyen bilim deneyleri seti. 8-12 yaş arası için ideal.', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=400&fit=crop', '₺200-400', 'https://toyzz.com/egitici-oyun-seti', 'Doğum Günü', 'Çocuk', ARRAY['Eğitim', 'Bilim'], NULL, 26, 26),

('Çocuk Sanat Seti', 'Boya, kalem, kağıt ve çıkartmalar içeren komple sanat seti.', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', '₺150-300', 'https://kirtasiye.com/cocuk-sanat-seti', 'Doğum Günü', 'Çocuk', ARRAY['Sanat', 'Eğitim'], NULL, 24, 24),

-- Kendine Hediye İçin
('Lüks Banyo Seti', 'Kendinizi şımartmak için lüks banyo ürünleri seti. Banyo bombası, yağ ve krem.', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', '₺300-500', 'https://thebodyshop.com.tr/banyo-seti', 'Kendine Hediye', 'Herkes', ARRAY['Sağlık & Wellness', 'Lüks'], NULL, 27, 27),

('Meditasyon Yastığı', 'Rahatlatıcı meditasyon ve yoga yastığı. Kişisel gelişim için ideal.', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', '₺200-400', 'https://decathlon.com.tr/meditasyon-yastigi', 'Kendine Hediye', 'Herkes', ARRAY['Sağlık & Wellness', 'Meditasyon'], NULL, 23, 23);
