'use client'; // Bu bileşenin client'ta çalışacağını belirtiyoruz

// Client-side hook'ları ve bileşenleri buraya import ediyoruz
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import Slideshow from "@/components/slideshow";
import Banner from "@/components/banners";
import CommunityBanners from "@/components/community-banners";
// Buraya TopSellingProducts'ı import ETMİYORUZ.

// Bu bileşen artık "children" prop'u alıyor.
// Bu children, sunucudan gelecek olan hazır HTML olacak.
export default function HomePageLayout({ children }: { children: React.ReactNode }) {
  // Client-side hook'ları burada güvenle kullanabilirsin
  const { user } = useAuth();
  const [filters, setFilters] = useState({});

  return (
    <div>
      {/* Bunlar Client Component olduğu için burada kalabilir */}
      <Slideshow />
      <CommunityBanners />
      <Banner />

      {/* Server Component'in (TopSellingProducts) yerleştirileceği yer burası.
        Sunucuda oluşturulmuş HTML, children olarak buraya gelecek.
      */}
      {children}
    </div>
  );
}