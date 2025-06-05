-- Add more products for each category to ensure we have good coverage

-- Technology Products
INSERT INTO gifts (title, description, image_url, price_range, affiliate_url, occasion, recipient, interests, submitted_by, upvotes, total_score) VALUES
('Kablosuz Şarj Standı', 'Hızlı kablosuz şarj özellikli şık tasarım standı. Telefon ve kulaklık için uyumlu.', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', '₺200-400', 'https://amazon.com.tr/kablosuz-sarj-standi', 'Doğum Günü', 'Teknoloji Meraklısı', ARRAY['Teknoloji'], NULL, 18, 18),

('Akıllı Ev Güvenlik Kamerası', 'WiFi bağlantılı, gece görüş özellikli güvenlik kamerası. Mobil uygulama ile kontrol.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', '₺800-1200', 'https://hepsiburada.com/guvenlik-kamerasi', 'Ev Hediyesi', 'Teknoloji Meraklısı', ARRAY['Teknoloji', 'Ev'], NULL, 22, 22),

-- Health & Wellness Products
('Masaj Tabancası', 'Kas gevşetici masaj tabancası, 6 farklı hız seviyesi. Spor sonrası rahatlama için ideal.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', '₺600-1000', 'https://decathlon.com.tr/masaj-tabancasi', 'Kendine Hediye', 'Spor Tutkunu', ARRAY['Sağlık & Wellness', 'Spor'], NULL, 25, 25),

('Aromaterapi Yastık', 'Lavanta dolgulu aromaterapi yastığı. Rahatlatıcı uyku için doğal çözüm.', 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop', '₺150-250', 'https://trendyol.com/aromaterapi-yastik', 'Kendine Hediye', 'Herkes', ARRAY['Sağlık & Wellness'], NULL, 19, 19),

-- Music Products
('Ukulele Başlangıç Seti', 'Yeni başlayanlar için komple ukulele seti. Kılıf, pena ve öğretici kitap dahil.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', '₺400-600', 'https://muzikmarket.com/ukulele-seti', 'Doğum Günü', 'Müzik Sever', ARRAY['Müzik'], NULL, 21, 21),

('Retro Radyo', 'Vintage tasarımlı Bluetooth radyo. FM/AM ve USB girişi olan nostaljik tasarım.', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&h=400&fit=crop', '₺300-500', 'https://mediamarkt.com.tr/retro-radyo', 'Ev Hediyesi', 'Müzik Sever', ARRAY['Müzik', 'Vintage'], NULL, 17, 17),

-- Gaming Products
('Mekanik Gaming Klavye', 'RGB aydınlatmalı mekanik klavye. Oyuncular için özel tasarım ve hızlı tepki.', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', '₺800-1500', 'https://gamegaraj.com/mekanik-klavye', 'Doğum Günü', 'Oyuncu', ARRAY['Oyun', 'Teknoloji'], NULL, 28, 28),

('Puzzle 1000 Parça', 'Yetişkinler için 1000 parçalık kaliteli puzzle. Sakinleştirici ve zihin açıcı aktivite.', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=400&fit=crop', '₺100-200', 'https://toyzz.com/puzzle-1000-parca', 'Her Özel Gün', 'Herkes', ARRAY['Oyun'], NULL, 15, 15),

-- Home & Living Products
('Bambu Çay Seti', 'Sürdürülebilir bambu malzemeden yapılmış şık çay seti. 6 kişilik servis.', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop', '₺300-500', 'https://karaca.com/bambu-cay-seti', 'Ev Hediyesi', 'Çay Sever', ARRAY['Ev', 'Sürdürülebilir'], NULL, 20, 20),

('LED Masa Lambası', 'Ayarlanabilir parlaklık ve renk sıcaklığı olan akıllı masa lambası. USB şarj portu dahil.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', '₺200-400', 'https://ikea.com.tr/led-masa-lambasi', 'Ev Hediyesi', 'Öğrenci', ARRAY['Ev', 'Teknoloji'], NULL, 16, 16),

-- Fashion & Accessories
('Deri Saat Kayışı', 'El yapımı gerçek deri saat kayışı. Farklı renk seçenekleri mevcut.', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop', '₺150-300', 'https://etsy.com/tr/deri-saat-kayisi', 'Doğum Günü', 'Erkek', ARRAY['Moda', 'Aksesuar'], NULL, 14, 14),

('Şık Eşarp', 'İpek karışımlı, desenli eşarp. Dört mevsim kullanılabilir şık aksesuar.', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop', '₺200-400', 'https://lcwaikiki.com/esarp', 'Kadın Günü', 'Kadın', ARRAY['Moda'], NULL, 18, 18),

-- Books & Culture
('Türk Edebiyatı Klasikleri', 'Türk edebiyatının en önemli eserlerinden oluşan 10 kitaplık set.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', '₺300-500', 'https://idefix.com/turk-edebiyati-klasikleri', 'Mezuniyet', 'Okur', ARRAY['Kitap', 'Kültür'], NULL, 23, 23),

('Sanat Malzemeleri Seti', 'Yağlı boya, fırça ve tuval içeren komple sanat seti. Başlangıç seviyesi için ideal.', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', '₺250-400', 'https://sanatmalzemeleri.com/yagli-boya-seti', 'Doğum Günü', 'Sanatçı', ARRAY['Sanat', 'DIY'], NULL, 19, 19),

-- Food & Drink
('Özel Kahve Çekirdekleri', 'Dünya çapından seçilmiş özel kahve çekirdekleri seti. 4 farklı ülkeden.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop', '₺200-350', 'https://kahvedunyasi.com/ozel-kahve-seti', 'Teşekkür', 'Kahve Sever', ARRAY['Yiyecek & İçecek'], NULL, 26, 26),

('Çikolata Yapım Kiti', 'Evde çikolata yapımı için gerekli tüm malzemeler ve tarif kitabı.', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop', '₺300-500', 'https://migros.com.tr/cikolata-yapim-kiti', 'Doğum Günü', 'Çikolata Sever', ARRAY['Yiyecek & İçecek', 'DIY'], NULL, 22, 22),

-- Sports & Fitness
('Yoga Blok Seti', 'Yoga pratiği için yardımcı blok seti. Farklı pozisyonlar için destek sağlar.', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', '₺150-250', 'https://decathlon.com.tr/yoga-blok-seti', 'Kendine Hediye', 'Yoga Sever', ARRAY['Spor', 'Sağlık & Wellness'], NULL, 17, 17),

('Su Şişesi Seti', 'Çelik termos su şişesi ve spor havlusu seti. Spor salonları için ideal.', 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop', '₺200-300', 'https://spx.com.tr/su-sisesi-seti', 'Spor', 'Spor Tutkunu', ARRAY['Spor', 'Sağlık'], NULL, 15, 15),

-- Photography & Art
('Tripod Seti', 'Profesyonel fotoğraf tripodu. Telefon ve kamera uyumlu, ayarlanabilir yükseklik.', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop', '₺300-600', 'https://fotografmakinesi.com/tripod-seti', 'Doğum Günü', 'Fotoğraf Meraklısı', ARRAY['Fotoğrafçılık'], NULL, 20, 20),

('Eskiz Defteri Seti', 'Farklı boyutlarda eskiz defterleri ve çizim kalemleri seti.', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', '₺150-300', 'https://sanatmalzemeleri.com/eskiz-seti', 'Öğrenci', 'Sanatçı', ARRAY['Sanat'], NULL, 18, 18);
