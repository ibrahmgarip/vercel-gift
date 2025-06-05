-- First, create a test user if none exists
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Check if we have any profiles
    SELECT id INTO test_user_id FROM profiles LIMIT 1;
    
    -- If no profiles exist, create a test user and profile
    IF test_user_id IS NULL THEN
        -- Insert into auth.users (requires admin privileges)
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            'test@example.com',
            '$2a$10$abcdefghijklmnopqrstuvwxyz123456789',
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"username":"TestUser","full_name":"Test User"}',
            NOW(),
            NOW()
        )
        RETURNING id INTO test_user_id;
        
        -- Create profile for the test user
        INSERT INTO profiles (id, username, full_name, points)
        VALUES (test_user_id, 'TestUser', 'Test User', 100);
    END IF;
    
    -- Now insert gifts using the test_user_id
    INSERT INTO gifts (title, description, image_url, price_range, affiliate_url, occasion, recipient, interests, submitted_by, upvotes, total_score) VALUES
    ('Akıllı Bileklik', 'Kalp atış hızı, adım sayısı ve uyku takibi yapabilen şık bir akıllı bileklik. Spor ve sağlık tutkunları için mükemmel bir hediye.', '/placeholder.svg?height=300&width=300', '₺500-1000', 'https://example.com/akilli-bileklik', 'Doğum Günü', 'Spor Tutkunu', ARRAY['Teknoloji', 'Sağlık'], test_user_id, 24, 24),

    ('El Yapımı Deri Cüzdan', 'Yüksek kaliteli gerçek deriden üretilmiş, kişiselleştirilebilir el yapımı cüzdan. İsim veya özel mesaj eklenebilir.', '/placeholder.svg?height=300&width=300', '₺300-600', 'https://example.com/deri-cuzdan', 'Yıldönümü', 'Eş', ARRAY['Moda', 'Kişiselleştirilmiş'], test_user_id, 18, 18),

    ('Türk Kahvesi Seti', 'Geleneksel bakır cezve, fincanlar ve özel çekilmiş Türk kahvesi içeren lüks set. Kahve severler için mükemmel bir hediye.', '/placeholder.svg?height=300&width=300', '₺200-400', 'https://example.com/turk-kahvesi-seti', 'Ev Hediyesi', 'Kahve Sever', ARRAY['Yiyecek & İçecek', 'Geleneksel'], test_user_id, 32, 32),

    ('Kişiselleştirilmiş Yıldız Haritası', 'Özel bir tarih ve konumdan gökyüzünün yıldız haritasını gösteren şık bir tablo. Romantik anıları ölümsüzleştirmek için ideal.', '/placeholder.svg?height=300&width=300', '₺150-300', 'https://example.com/yildiz-haritasi', 'Sevgililer Günü', 'Romantik Partner', ARRAY['Sanat', 'Kişiselleştirilmiş'], test_user_id, 27, 27),

    ('Akıllı Ev Asistanı', 'Sesli komutlarla müzik çalabilen, hava durumunu söyleyebilen ve akıllı ev cihazlarını kontrol edebilen modern bir ev asistanı.', '/placeholder.svg?height=300&width=300', '₺800-1500', 'https://example.com/akilli-ev-asistani', 'Yeni Ev', 'Teknoloji Meraklısı', ARRAY['Teknoloji', 'Ev'], test_user_id, 15, 15),

    ('Aromatik Mum Seti', 'Farklı kokulardan oluşan el yapımı aromatik mumlar. Rahatlatıcı bir atmosfer yaratmak için ideal.', '/placeholder.svg?height=300&width=300', '₺100-200', 'https://example.com/aromatik-mum-seti', 'Kendine Hediye', 'Herkes', ARRAY['Ev', 'Sağlık & Wellness'], test_user_id, 22, 22),

    ('Vintage Vinil Pikap', 'Retro tasarımlı modern özellikli pikap. Vinil koleksiyonerler ve müzik tutkunları için mükemmel.', '/placeholder.svg?height=300&width=300', '₺1000-2000', 'https://example.com/vinil-pikap', 'Yılbaşı', 'Müzik Sever', ARRAY['Müzik', 'Vintage'], test_user_id, 19, 19),

    ('Sukulent Bahçe Seti', '6 farklı sukulent, dekoratif saksılar ve bakım talimatları içeren komple set. Yeni başlayanlar için ideal.', '/placeholder.svg?height=300&width=300', '₺150-300', 'https://example.com/sukulent-seti', 'Teşekkür', 'Bitki Sever', ARRAY['Bahçecilik', 'DIY'], test_user_id, 14, 14);
END $$;
