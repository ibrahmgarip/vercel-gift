-- First, let's modify the gifts table to allow NULL submitted_by temporarily for test data
ALTER TABLE gifts ALTER COLUMN submitted_by DROP NOT NULL;

-- Insert Turkish gifts with NULL submitted_by (we'll update this later when users sign up)
INSERT INTO gifts (title, description, image_url, price_range, affiliate_url, occasion, recipient, interests, submitted_by, upvotes, total_score) VALUES
('Akıllı Bileklik', 'Kalp atış hızı, adım sayısı ve uyku takibi yapabilen şık bir akıllı bileklik. Spor ve sağlık tutkunları için mükemmel bir hediye.', '/placeholder.svg?height=300&width=300', '₺500-1000', 'https://amazon.com.tr/akilli-bileklik', 'Doğum Günü', 'Spor Tutkunu', ARRAY['Teknoloji', 'Sağlık'], NULL, 24, 24),

('El Yapımı Deri Cüzdan', 'Yüksek kaliteli gerçek deriden üretilmiş, kişiselleştirilebilir el yapımı cüzdan. İsim veya özel mesaj eklenebilir.', '/placeholder.svg?height=300&width=300', '₺300-600', 'https://etsy.com/tr/deri-cuzdan', 'Yıldönümü', 'Eş', ARRAY['Moda', 'Kişiselleştirilmiş'], NULL, 18, 18),

('Türk Kahvesi Seti', 'Geleneksel bakır cezve, fincanlar ve özel çekilmiş Türk kahvesi içeren lüks set. Kahve severler için mükemmel bir hediye.', '/placeholder.svg?height=300&width=300', '₺200-400', 'https://hepsiburada.com/turk-kahvesi-seti', 'Ev Hediyesi', 'Kahve Sever', ARRAY['Yiyecek & İçecek', 'Geleneksel'], NULL, 32, 32),

('Kişiselleştirilmiş Yıldız Haritası', 'Özel bir tarih ve konumdan gökyüzünün yıldız haritasını gösteren şık bir tablo. Romantik anıları ölümsüzleştirmek için ideal.', '/placeholder.svg?height=300&width=300', '₺150-300', 'https://etsy.com/tr/yildiz-haritasi', 'Sevgililer Günü', 'Romantik Partner', ARRAY['Sanat', 'Kişiselleştirilmiş'], NULL, 27, 27),

('Akıllı Ev Asistanı', 'Sesli komutlarla müzik çalabilen, hava durumunu söyleyebilen ve akıllı ev cihazlarını kontrol edebilen modern bir ev asistanı.', '/placeholder.svg?height=300&width=300', '₺800-1500', 'https://amazon.com.tr/akilli-ev-asistani', 'Yeni Ev', 'Teknoloji Meraklısı', ARRAY['Teknoloji', 'Ev'], NULL, 15, 15),

('Aromatik Mum Seti', 'Farklı kokulardan oluşan el yapımı aromatik mumlar. Rahatlatıcı bir atmosfer yaratmak için ideal.', '/placeholder.svg?height=300&width=300', '₺100-200', 'https://trendyol.com/aromatik-mum-seti', 'Kendine Hediye', 'Herkes', ARRAY['Ev', 'Sağlık & Wellness'], NULL, 22, 22),

('Vintage Vinil Pikap', 'Retro tasarımlı modern özellikli pikap. Vinil koleksiyonerler ve müzik tutkunları için mükemmel.', '/placeholder.svg?height=300&width=300', '₺1000-2000', 'https://gittigidiyor.com/vinil-pikap', 'Yılbaşı', 'Müzik Sever', ARRAY['Müzik', 'Vintage'], NULL, 19, 19),

('Sukulent Bahçe Seti', '6 farklı sukulent, dekoratif saksılar ve bakım talimatları içeren komple set. Yeni başlayanlar için ideal.', '/placeholder.svg?height=300&width=300', '₺150-300', 'https://ciceksepeti.com/sukulent-seti', 'Teşekkür', 'Bitki Sever', ARRAY['Bahçecilik', 'DIY'], NULL, 14, 14),

('Bluetooth Hoparlör', 'Su geçirmez, taşınabilir Bluetooth hoparlör. Plaj, piknik ve açık hava etkinlikleri için mükemmel.', '/placeholder.svg?height=300&width=300', '₺400-800', 'https://mediamarkt.com.tr/bluetooth-hoparlor', 'Doğum Günü', 'Müzik Sever', ARRAY['Teknoloji', 'Müzik'], NULL, 21, 21),

('Yoga Matı ve Aksesuar Seti', 'Yüksek kaliteli yoga matı, blok ve kayış içeren komple set. Yoga ve fitness tutkunları için ideal.', '/placeholder.svg?height=300&width=300', '₺200-400', 'https://decathlon.com.tr/yoga-seti', 'Kendine Hediye', 'Fitness Tutkunu', ARRAY['Sağlık & Wellness', 'Spor'], NULL, 16, 16),

('Kahve Değirmeni', 'Manuel kahve değirmeni, taze çekilmiş kahve için. Kahve ritüelini seven herkes için mükemmel.', '/placeholder.svg?height=300&width=300', '₺300-600', 'https://kahvedunyasi.com/kahve-degirmeni', 'Ev Hediyesi', 'Kahve Sever', ARRAY['Yiyecek & İçecek', 'Ev'], NULL, 13, 13),

('Çay Seti', 'Geleneksel Türk çayı bardakları ve çaydanlık seti. Çay severlerin keyifle kullanacağı şık bir set.', '/placeholder.svg?height=300&width=300', '₺250-500', 'https://karaca.com/cay-seti', 'Ev Hediyesi', 'Çay Sever', ARRAY['Yiyecek & İçecek', 'Geleneksel'], NULL, 20, 20),

('Akıllı Saat', 'Fitness takibi, mesaj bildirimleri ve sağlık monitörü özellikli akıllı saat. Teknoloji tutkunları için ideal.', '/placeholder.svg?height=300&width=300', '₺1500-3000', 'https://apple.com/tr/watch', 'Doğum Günü', 'Teknoloji Meraklısı', ARRAY['Teknoloji', 'Sağlık'], NULL, 28, 28),

('El Yapımı Sabun Seti', 'Doğal malzemelerden üretilmiş, farklı kokulardan oluşan el yapımı sabun seti. Cilt bakımı için ideal.', '/placeholder.svg?height=300&width=300', '₺100-200', 'https://loccitane.com.tr/sabun-seti', 'Kendine Hediye', 'Herkes', ARRAY['Sağlık & Wellness', 'Doğal'], NULL, 17, 17),

('Kitap Seti - Türk Klasikleri', 'Türk edebiyatının en önemli eserlerinden oluşan özel ciltli kitap seti. Okuma tutkunları için harika bir hediye.', '/placeholder.svg?height=300&width=300', '₺200-400', 'https://idefix.com/turk-klasikleri-seti', 'Mezuniyet', 'Okur', ARRAY['Kitap', 'Kültür'], NULL, 23, 23);
