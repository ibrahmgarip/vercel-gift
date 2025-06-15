import Image from 'next/image';

// 1. Ürünlerimizin veri yapısını tanımlıyoruz (TypeScript)
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
};

// 2. Veri çekme fonksiyonu
// Bu fonksiyon SADECE SUNUCUDA çalışır.
// Gerçek uygulamada, API'nızdan veya veritabanınızdan veri çekeceksiniz.
async function getTopSellingProducts(): Promise<Product[]> {
  // --- ÖRNEK VERİ ---
  // Burası, API'nıza fetch isteği atacağınız yerdir.
  // const res = await fetch('http://.../api/products/top-selling');
  // const data = await res.json();
  // return data;

  // Şimdilik örnek (mock) veri döndürüyoruz:
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Ergonomik Ofis Sandalyesi',
      category: 'Mobilya',
      price: 4850.00,
      imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=400',
    },
    {
      id: '2',
      name: 'Mekanik Oyuncu Klavyesi',
      category: 'Elektronik',
      price: 2100.00,
      imageUrl: 'https://images.unsplash.com/photo-1618384887924-2c8ab63a1a06?q=80&w=400',
    },
    {
      id: '3',
      name: 'Narenciye Özlü Serum',
      category: 'Kişisel Bakım',
      price: 750.50,
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f168a7673b?q=80&w=400',
    },
    {
      id: '4',
      name: 'Kablosuz Gürültü Engelleme Kulaklık',
      category: 'Elektronik',
      price: 3500.00,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400',
    },
  ];

  // Küçük bir gecikme simülasyonu
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockProducts;
}

// 3. Ana "Server Component"
// Bu bileşen, veriyi sunucuda `await` ile bekler ve sayfayı hazır olarak tarayıcıya gönderir.
export default async function TopSellingProducts() {
  const products = await getTopSellingProducts();

  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Çok Satan Ürünlerimiz
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Müşterilerimizin favorilerini keşfedin.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. Ürün Kartı Alt-Bileşeni (Daha temiz bir kod için)
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
      <div className="aspect-w-3 aspect-h-4 bg-gray-200 sm:aspect-none sm:h-60">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-lg font-semibold text-gray-900">
          <span aria-hidden="true" className="absolute inset-0" />
          {product.name}
        </h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-xl font-bold text-gray-900">
            {product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </p>
        </div>
      </div>
    </div>
  );
}