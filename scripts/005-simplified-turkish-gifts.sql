-- Alternative approach: Create a simpler script that works with existing users
-- First, check if we have any users
DO $$
DECLARE
    user_count INTEGER;
    test_user_id UUID;
BEGIN
    -- Count existing profiles
    SELECT COUNT(*) INTO user_count FROM profiles;
    
    -- If no profiles exist, we can't add gifts
    IF user_count = 0 THEN
        RAISE EXCEPTION 'No user profiles found. Please create at least one user account before running this script.';
    END IF;
    
    -- Get the first available user ID
    SELECT id INTO test_user_id FROM profiles LIMIT 1;
    
    -- Now insert gifts using the existing user ID
    INSERT INTO gifts (title, description, image_url, price_range, affiliate_url, occasion, recipient, interests, submitted_by, upvotes, total_score) VALUES
    ('Akıllı Bileklik', 'Kalp atış hızı, adım sayısı ve uyku takibi yapabilen şık bir akıllı bileklik. Spor ve sağlık tutkunları için mükemmel bir hediye.', '/placeholder.svg?height=300&width=300', '₺500-1000', 'https://example.com/akilli-bileklik', 'Doğum Günü', 'Spor Tutkunu', ARRAY['Teknoloji', 'Sağlık'], test_user_id, 24, 24),

    ('El Yapımı Deri Cüzdan', 'Yüksek kaliteli gerçek deriden üretilmiş, kişiselleştirilebilir el yapımı cüzdan. İsim veya özel mesaj eklenebilir.', '/placeholder.svg?height=300&width=300', '₺300-600', 'https://example.com/deri-cuzdan', 'Yıldönümü', 'Eş', ARRAY['Moda', 'Kişiselleştirilmiş'], test_user_id, 18, 18),

    ('Türk Kahvesi Seti', 'Geleneksel bakır cezve, fincanlar ve özel çekilmiş Türk kahvesi içeren lüks set. Kahve severler için mükemmel bir hediye.', '/placeholder.svg?height=300&width=300', '₺200-400', 'https://example.com/turk-kahvesi-seti', 'Ev Hediyesi', 'Kahve Sever', ARRAY['Yiyecek & İçecek', 'Geleneksel'], test_user_id, 32, 32),

    ('Kişiselleştirilmiş Yıldız Haritası', 'Özel bir tarih ve konumdan gökyüzünün yıldız haritasını gösteren şık bir tablo. Romantik anıları ölümsüzleştirmek için ideal.', '/placeholder.svg?height=300&width=300', '₺150-300', 'https://example.com/yildiz-haritasi', 'Sevgililer Günü', 'Romantik Partner', ARRAY['Sanat', 'Kişiselleştirilmiş'], test_user_id, 27, 27);
END $$;
