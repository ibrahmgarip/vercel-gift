"use client"

import { useEffect, useState } from "react"
import { GiftCard } from "@/components/gift-card"
import { GiftFilters } from "@/components/gift-filters"
import { TopSellingProducts } from "@/components/top-selling-products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Gift, Users, Star } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { GiftCategories } from "@/components/gift-categories"
import Link from "next/link"

interface Filters {
  occasion: string[]
  recipient: string[]
  interests: string[]
  priceRange: string[]
  sortBy: string
}

export default function HomePage() {
  return (
    <div>test123</div>
  )
}