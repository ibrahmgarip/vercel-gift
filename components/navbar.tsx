"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from 'react';
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gift, Plus, User, LogOut, Search, Heart, Package, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input"; // Assuming Input is for the search bar

const categories = [
  {
    name: "yeni",
    subcategories: ["Yeni Gelenler", "Popüler", "Son Eklenenler"],
    image: "/slideshow.webp",
  },
  {
    name: "babalar günü",
    subcategories: ["Babalar Günü Hediyeleri", "Kişiye Özel Hediyeler", "Deneyimler"],
    image: "/slideshow.webp",
  },
  {
    name: "hediyelik",
    subcategories: ["Benzersiz Hediyeler", "Özel Tasarım Hediyeler", "Temalı Hediyeler"],
    image: "/slideshow.webp",
  },
  {
    name: "ilgi alanları",
    subcategories: ["Spor", "Teknoloji", "Doğa"],
    image: "/slideshow.webp",
  },
  {
    name: "doğum günü",
    subcategories: ["Kadınlara Doğum Günü Hediyeleri", "Erkeklere Doğum Günü Hediyeleri", "Önemli Doğum Günleri"],
    image: "/slideshow.webp",
  },
  {
    name: "erkek",
    subcategories: ["Erkeklere Hediyeler", "Aksesuarlar", "Bakım"],
    image: "/slideshow.webp",
  },
  {
    name: "kadın",
    subcategories: ["Kadınlara Hediyeler", "Takı", "Moda"],
    image: "/slideshow.webp",
  },
  {
    name: "çocuk",
    subcategories: ["Çocuklara Hediyeler", "Oyuncaklar", "Kitaplar"],
    image: "/slideshow.webp",
  },
  {
    name: "mutfak & bar",
    subcategories: ["Mutfak Aletleri", "Bar Malzemeleri", "Yemek Kitapları"],
    image: "/slideshow.webp",
  },
  {
    name: "ev & bahçe",
    subcategories: ["Ev Dekorasyonu", "Bahçe Aletleri", "Dış Mekan"],
    image: "/slideshow.webp",
  },
  {
    name: "takı & aksesuar",
    subcategories: ["Kolyeler", "Küpeler", "Bilezikler"],
    image: "/slideshow.webp",
  },
  {
    name: "deneyimler",
    subcategories: ["Yemek Kursları", "Şarap Tadımları", "Macera Aktiviteleri"],
    image: "/slideshow.webp",
  },
  {
    name: "kurumsal hediyeler",
    subcategories: ["Çalışan Hediyeleri", "Müşteri Hediyeleri", "Promosyon Ürünleri"],
    image: "/slideshow.webp",
  },
  {
    name: "indirimler",
    subcategories: ["İndirimli Ürünler", "Fırsatlar", "Haftanın Fırsatları"],
    image: "/slideshow.webp",
  },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const [searchText, setSearchText] = useState('');
  const phrases = [
    "ara | erkek kardeşim için hediyeler, bilimden, oyunlardan ve sanattan hoşlanıyor",
    "ara | anne için hediyeler, el yapımı ve kişisel dokunuşlu",
    "ara | baba için hediyeler, balık",
    "ara | kız kardeşim için hediyeler, moda ve güzellik ürünleri",
    "ara | erkek için hediyeler, teknoloji ve spor ürünleri",
    "ara | çocuk için hediyeler, oyuncaklar ve eğitim materyalleri",
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [openCategory, setOpenCategory] = useState(null);
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({ left: '0' });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000); // Change phrase every 3 seconds

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [phrases.length]);

  useEffect(() => {
    setSearchText(phrases[phraseIndex]);
  }, [phraseIndex, phrases]);

  const handleMouseEnter = (categoryName) => {
    clearTimeout(timeoutRef.current);
    setOpenCategory(categoryName);

    // Use a small delay to ensure the menu is rendered before calculating its position
    setTimeout(() => {
      if (menuRef.current) {
        const menuWidth = menuRef.current.offsetWidth;
        const windowWidth = window.innerWidth;
        const menuRect = menuRef.current.getBoundingClientRect();

        if (menuRect.right > windowWidth) {
          const overflow = menuRect.right - windowWidth;
          setMenuStyle({ left: `-${overflow}px` });
        } else {
          setMenuStyle({ left: '0' });
        }
      }
    }, 50);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
    }, 100);
    setMenuStyle({ left: '0' }); // Reset the left style when the menu is closed
  };

  const handleClick = (categoryName) => {
    setOpenCategory((prevOpenCategory) => (prevOpenCategory === categoryName ? null : categoryName));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl w-full flex h-16 items-center justify-between px-4">
        {/* Colorful Top Bar - Placeholder divs for colors */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-orange-500"></div>
          <div className="flex-1 bg-green-700"></div>
          <div className="flex-1 bg-teal-500"></div>
          <div className="flex-1 bg-pink-500"></div>
          <div className="flex-1 bg-orange-300"></div>
          <div className="flex-1 bg-blue-300"></div>
        </div>

        {/* Main Header Section */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            {/* Placeholder for Uncommon Goods logo */}
            <span className="text-green-700 text-4xl font-serif">hedify</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-center flex-1 max-w-md mx-4 border rounded-full overflow-hidden bg-gray-100">
          <div className="flex items-center w-full px-3 py-1">
            <Search className="h-4 w-4 text-gray-500 mr-2" />
            <Input
              placeholder={searchText}
              className="w-full border-none focus:ring-0 focus-visible:ring-0 bg-transparent text-sm"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Giriş Yap
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Favoriler
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Gift className="h-4 w-4" />
            Hediye Bulucu
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ShoppingCart className="h-4 w-4" />
            Sepet
          </Button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="mx-auto max-w-7xl w-full flex items-center justify-center h-10 text-sm border-t">
        <nav className="flex items-center gap-6">
          {categories.map((category) => {
            return (
              <div
                key={category.name}
                className="relative"
                onMouseEnter={() => handleMouseEnter(category.name)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(category.name)}
                ref={menuRef}
              >
                <Link href="#" className="hover:underline">
                  {category.name}
                </Link>
                <div
                  className={`absolute mt-2 w-[800px] h-[400px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${openCategory === category.name ? 'block' : 'hidden'} flex`}
                  style={{ ...menuStyle }}
                >
                  <div className="w-2/3 p-4">
                    <ul className="grid gap-2">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory}>
                          <Link href="#" className="hover:underline block px-4 py-2 rounded-md hover:bg-gray-100">
                            {subcategory}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-1/3">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover rounded-r-md"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
