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
    name: "Yeni",
    subcategories: ["Yeni Gelenler", "Popüler", "Son Eklenenler"],
    image: "/slideshow.webp",
  },
  {
    name: "Babalar Günü",
    subcategories: ["Babalar Günü Hediyeleri", "Kişiye Özel Hediyeler", "Deneyimler"],
    image: "/slideshow.webp",
  },
  {
    name: "Hediyelik",
    subcategories: ["Benzersiz Hediyeler", "Özel Tasarım Hediyeler", "Temalı Hediyeler"],
    image: "/slideshow.webp",
  },
  {
    name: "İlgi Alanları",
    subcategories: ["Spor", "Teknoloji", "Doğa"],
    image: "/slideshow.webp",
  },
  {
    name: "Doğum Günü",
    subcategories: ["Kadınlara Doğum Günü Hediyeleri", "Erkeklere Doğum Günü Hediyeleri", "Önemli Doğum Günleri"],
    image: "/slideshow.webp",
  },
  {
    name: "Erkek",
    subcategories: ["Erkeklere Hediyeler", "Aksesuarlar", "Bakım"],
    image: "/slideshow.webp",
  },
  {
    name: "Kadın",
    subcategories: ["Kadınlara Hediyeler", "Takı", "Moda"],
    image: "/slideshow.webp",
  },
  {
    name: "Çocuk",
    subcategories: ["Çocuklara Hediyeler", "Oyuncaklar", "Kitaplar"],
    image: "/slideshow.webp",
  },
  {
    name: "Mutfak & Bar",
    subcategories: ["Mutfak Aletleri", "Bar Malzemeleri", "Yemek Kitapları"],
    image: "/slideshow.webp",
  },
  {
    name: "Ev & Bahçe",
    subcategories: ["Ev Dekorasyonu", "Bahçe Aletleri", "Dış Mekan"],
    image: "/slideshow.webp",
  },
  {
    name: "Takı & Aks.",
    subcategories: ["Kolyeler", "Küpeler", "Bilezikler"],
    image: "/slideshow.webp",
  },
  {
    name: "Deneyimler",
    subcategories: ["Yemek Kursları", "Şarap Tadımları", "Macera Aktiviteleri"],
    image: "/slideshow.webp",
  },
  {
    name: "Kurumsal",
    subcategories: ["Çalışan Hediyeleri", "Müşteri Hediyeleri", "Promosyon Ürünleri"],
    image: "/slideshow.webp",
  },
  {
    name: "İndirimler",
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

  const handleMouseEnter = (categoryName) => {
    clearTimeout(timeoutRef.current);
    setOpenCategory(categoryName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
    }, 100);
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

      {/* Mega Menu Navigation Bar */}
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8 mt-2">
          <nav className="relative z-10" aria-label="Global">
            <div className="flex w-full items-center justify-between">
              <div className="flex w-full items-center justify-between space-x-2 lg:w-auto">
                {/* Category Links */}
                <div className="hidden lg:ml-10 lg:flex">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="relative group"
                      onMouseEnter={() => handleMouseEnter(category.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        type="button"
                        className="text-gray-700 inline-flex items-center space-x-2 rounded-md border border-transparent px-2 py-1 text-sm font-normal hover:text-gray-900 focus:outline-none"
                      >
                        <span>{category.name}</span>
                      </button>

                      {/* Mega Menu Dropdown */}
                      <div
                        className={`${
                          openCategory === category.name ? 'block' : 'hidden'
                        } absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-4 sm:px-0`}
                      >
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                            {category.subcategories.map((subcategory) => (
                              <Link
                                key={subcategory}
                                href="#"
                                className="-m-3 block rounded-md p-3 hover:bg-gray-50 transition ease-in-out duration-150"
                              >
                                <p className="text-base font-medium text-gray-900">{subcategory}</p>
                              </Link>
                            ))}
                          </div>
                          {/* Image Section */}
                          <div className="bg-gray-50 px-5 py-5 sm:py-6">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="h-32 w-full object-cover rounded-r-md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
