// BU DOSYA ARTIK BİR SERVER COMPONENT.
// Başında 'use client' YOK.

import HomePageLayout from '@/components/home-page-layout';
import TopSellingProducts from '@/components/top-selling-products';

export default function HomePage() {
  return (
    <main>
      {/*
        Client Component olan layout'u çağırıyoruz
        VE
        Server Component olan TopSellingProducts'ı onun içine "children" olarak gönderiyoruz.
      */}
      <HomePageLayout>
        <TopSellingProducts />
      </HomePageLayout>
    </main>
  );
}