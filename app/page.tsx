"use client"

import { useEffect, useState } from "react"
import { GiftCard } from "@/components/gift-card"
import { GiftFilters } from "@/components/gift-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Gift, Users, Star } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { GiftCategories } from "@/components/gift-categories"
import Link from "next/link"
import Slideshow from "@/components/slideshow"
import Banner from "@/components/banners"
import CommunityBanners from "@/components/community-banners"

interface Filters {
  occasion: string[]
  recipient: string[]
  interests: string[]
  priceRange: string[]
  sortBy: string
}

export default function HomePage() {
  return (
    <div>
      <Slideshow />
      <Banner />
      <CommunityBanners />
      <div className="w-7xl max-w-7xl mx-auto px-4 mt-4">
        <h1 className="text-2xl  mb-4 mt-2">Kategoriler</h1>
        <GiftCategories />
        < /div>
      {/* Add other main page content here later */}
    </div>
  )
}