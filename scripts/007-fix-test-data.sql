-- Temporarily disable the foreign key constraint to insert test data
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Create a test profile without the foreign key constraint
INSERT INTO profiles (id, username, full_name, points, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'TestKullanici',
    'Test Kullanıcı',
    50,
    NOW(),
    NOW()
)
ON CONFLICT (username) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    points = EXCLUDED.points;

-- Insert Turkish gifts using the test user ID
INSERT INTO gifts (title, description, image_url, price_range, affiliate_url, occasion, recipient, interests, submitted_by, upvotes, total_score) VALUES
('Akıllı Bileklik', 'Kalp atış hızı, adım sayısı ve uyku takibi yapabilen şık bir akıllı bileklik. Spor ve sağlık tutkunları için mükemmel bir hediye.', '/placeholder.svg?height=300&width=300', '₺500-1000', 'https://example.com/akilli-bileklik', 'Doğum Günü', 'Spor Tutkunu', ARRAY['Teknoloji', 'Sağlık'], '00000000-0000-0000-0000-000000000001'::uuid, 24, 24),

('El Yapımı Deri Cüzdan', 'Yüksek kaliteli gerçek deriden üretilmiş, kişiselleştirilebilir el yapımı cüzdan. İsim veya özel mesaj eklenebilir.', '/placeholder.svg?height=300&width=300', '₺300-600', 'https://example.com/deri-cuzdan', 'Yıldönümü', 'Eş', ARRAY['Moda', 'Kişiselleştirilmiş'], '00000000-0000-0000-0000-000000000001'::uuid, 18, 18),

('Türk Kahvesi Seti', 'Geleneksel bakır cezve, fincanlar ve özel çekilmiş Türk kahvesi içeren lüks set. Kahve severler için mükemmel bir hediye.', '/placeholder.svg?height=300&width=300', '₺200-400', 'https://example.com/turk-kahvesi-seti', 'Ev Hediyesi', 'Kahve Sever', ARRAY['Yiyecek & İçecek', 'Geleneksel'], '00000000-0000-0000-0000-000000000001'::uuid, 32, 32),

('Kişiselleştirilmiş Yıldız Haritası', 'Özel bir tarih ve konumdan gökyüzünün yıldız haritasını gösteren şık bir tablo. Romantik anıları ölümsüzleştirmek için ideal.', '/placeholder.svg?height=300&width=300', '₺150-300', 'https://example.com/yildiz-haritasi', 'Sevgililer Günü', 'Romantik Partner', ARRAY['Sanat', 'Kişiselleştirilmiş'], '00000000-0000-0000-0000-000000000001'::uuid, 27, 27),

('Akıllı Ev Asistanı', 'Sesli komutlarla müzik çalabilen, hava durumunu söyleyebilen ve akıllı ev cihazlarını kontrol edebilen modern bir ev asistanı.', '/placeholder.svg?height=300&width=300', '₺800-1500', 'https://example.com/akilli-ev-asistani', 'Yeni Ev', 'Teknoloji Meraklısı', ARRAY['Teknoloji', 'Ev'], '00000000-0000-0000-0000-000000000001'::uuid, 15, 15),

('Aromatik Mum Seti', 'Farklı kokulardan oluşan el yapımı aromatik mumlar. Rahatlatıcı bir atmosfer yaratmak için ideal.', '/placeholder.svg?height=300&width=300', '₺100-200', 'https://example.com/aromatik-mum-seti', 'Kendine Hediye', 'Herkes', ARRAY['Ev', 'Sağlık & Wellness'], '00000000-0000-0000-0000-000000000001'::uuid, 22, 22),

('Vintage Vinil Pikap', 'Retro tasarımlı modern özellikli pikap. Vinil koleksiyonerler ve müzik tutkunları için mükemmel.', '/placeholder.svg?height=300&width=300', '₺1000-2000', 'https://example.com/vinil-pikap', 'Yılbaşı', 'Müzik Sever', ARRAY['Müzik', 'Vintage'], '00000000-0000-0000-0000-000000000001'::uuid, 19, 19),

('Sukulent Bahçe Seti', '6 farklı sukulent, dekoratif saksılar ve bakım talimatları içeren komple set. Yeni başlayanlar için ideal.', '/placeholder.svg?height=300&width=300', '₺150-300', 'https://example.com/sukulent-seti', 'Teşekkür', 'Bitki Sever', ARRAY['Bahçecilik', 'DIY'], '00000000-0000-0000-0000-000000000001'::uuid, 14, 14),

('Bluetooth Hoparlör', 'Su geçirmez, taşınabilir Bluetooth hoparlör. Plaj, piknik ve açık hava etkinlikleri için mükemmel.', '/placeholder.svg?height=300&width=300', '₺400-800', 'https://example.com/bluetooth-hoparlor', 'Doğum Günü', 'Müzik Sever', ARRAY['Teknoloji', 'Müzik'], '00000000-0000-0000-0000-000000000001'::uuid, 21, 21),

('Yoga Matı ve Aksesuar Seti', 'Yüksek kaliteli yoga matı, blok ve kayış içeren komple set. Yoga ve fitness tutkunları için ideal.', '/placeholder.svg?height=300&width=300', '₺200-400', 'https://example.com/yoga-seti', 'Kendine Hediye', 'Fitness Tutkunu', ARRAY['Sağlık & Wellness', 'Spor'], '00000000-0000-0000-0000-000000000001'::uuid, 16, 16),

('Kahve Değirmeni', 'Manuel kahve değirmeni, taze çekilmiş kahve için. Kahve ritüelini seven herkes için mükemmel.', '/placeholder.svg?height=300&width=300', '₺300-600', 'https://example.com/kahve-degirmeni', 'Ev Hediyesi', 'Kahve Sever', ARRAY['Yiyecek & İçecek', 'Ev'], '00000000-0000-0000-0000-000000000001'::uuid, 13, 13),

('Kişiselleştirilmiş Fotoğraf Albümü', 'El yapımı, kişiselleştirilmiş fotoğraf albümü. Özel anıları saklamak için romantik bir hediye.', '/placeholder.svg?height=300&width=300', '₺150-300', 'https://example.com/fotograf-albumu', 'Yıldönümü', 'Romantik Partner', ARRAY['Kişiselleştirilmiş', 'Anı'], '00000000-0000-0000-0000-000000000001'::uuid, 25, 25),

('Çay Seti', 'Geleneksel Türk çayı bardakları ve çaydanlık seti. Çay severlerin keyifle kullanacağı şık bir set.', '/placeholder.svg?height=300&width=300', '₺250-500', 'https://example.com/cay-seti', 'Ev Hediyesi', 'Çay Sever', ARRAY['Yiyecek & İçecek', 'Geleneksel'], '00000000-0000-0000-0000-000000000001'::uuid, 20, 20),

('Akıllı Saat', 'Fitness takibi, mesaj bildirimleri ve sağlık monitörü özellikli akıllı saat. Teknoloji tutkunları için ideal.', '/placeholder.svg?height=300&width=300', '₺1500-3000', 'https://example.com/akilli-saat', 'Doğum Günü', 'Teknoloji Meraklısı', ARRAY['Teknoloji', 'Sağlık'], '00000000-0000-0000-0000-000000000001'::uuid, 28, 28),

('El Yapımı Sabun Seti', 'Doğal malzemelerden üretilmiş, farklı kokulardan oluşan el yapımı sabun seti. Cilt bakımı için ideal.', '/placeholder.svg?height=300&width=300', '₺100-200', 'https://example.com/sabun-seti', 'Kendine Hediye', 'Herkes', ARRAY['Sağlık & Wellness', 'Doğal'], '00000000-0000-0000-0000-000000000001'::uuid, 17, 17);

-- Re-add the foreign key constraint but make it deferrable for future use
ALTER TABLE profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) 
ON DELETE CASCADE 
DEFERRABLE INITIALLY DEFERRED;
