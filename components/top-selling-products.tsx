"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GiftCard } from "@/components/gift-card"
import { TrendingUp, Crown, FlameIcon as Fire, Star, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

interface TopSellingProduct {
  gift_id: string
  title: string
  image_url: string
  price_range: string
  total_score: number
  sales_count: number
  click_count: number
  popularity_score: number
  rank_in_category: number
  category_id: string
}

interface TopSellingProductsProps {
  categoryId?: string
  limit?: number
  showAllCategories?: boolean
}

const CATEGORY_NAMES: Record<string, string> = {
  teknoloji: "Teknoloji",
  "saglik-wellness": "Sağlık & Wellness",
  muzik: "Müzik",
  oyun: "Oyun & Eğlence",
  "ev-yasam": "Ev & Yaşam",
  moda: "Moda & Aksesuar",
  "kitap-kultur": "Kitap & Kültür",
  "yiyecek-icecek": "Yiyecek & İçecek",
  "spor-fitness": "Spor & Fitness",
  fotograf: "Fotoğraf & Sanat",
  "erkek-arkadas": "Erkek Arkadaş İçin",
  "kiz-arkadas": "Kız Arkadaş İçin",
  "anneler-gunu": "Anneler Günü",
  "babalar-gunu": "Babalar Günü",
  "sevgililer-gunu": "Sevgililer Günü",
  "yeni-is-kutlamasi": "Yeni İş Kutlaması",
  mezuniyet: "Mezuniyet",
  yildonumu: "Yıldönümü",
  "cocuklar-icin": "Çocuklar İçin",
  "kendine-hediye": "Kendine Hediye",
}

const CATEGORIES = [
  { id: "teknoloji", interests: ["teknoloji", "elektronik"] },
  { id: "saglik-wellness", interests: ["sağlık", "wellness", "güzellik"] },
  { id: "muzik", interests: ["müzik", "konser", "enstrüman"] },
  { id: "oyun", interests: ["oyun", "e-spor", "video oyunları"] },
  { id: "ev-yasam", interests: ["ev", "dekorasyon", "mobilya"] },
  { id: "moda", interests: ["moda", "giyim", "aksesuar"] },
  { id: "kitap-kultur", interests: ["kitap", "kültür", "sanat"] },
  { id: "yiyecek-icecek", interests: ["yiyecek", "içecek", "gurme"] },
  { id: "spor-fitness", interests: ["spor", "fitness", "outdoor"] },
  { id: "fotograf", interests: ["fotoğraf", "sanat", "galeri"] },
  { id: "erkek-arkadas", interests: ["erkek", "hediye", "erkek arkadaş"] },
  { id: "kiz-arkadas", interests: ["kız", "hediye", "kız arkadaş"] },
  { id: "anneler-gunu", interests: ["anne", "anneler günü", "çiçek"] },
  { id: "babalar-gunu", interests: ["baba", "babalar günü", "teknoloji"] },
  { id: "sevgililer-gunu", interests: ["sevgili", "sevgililer günü", "romantik"] },
  { id: "yeni-is-kutlamasi", interests: ["iş", "kutlama", "kariyer"] },
  { id: "mezuniyet", interests: ["mezuniyet", "üniversite", "lise"] },
  { id: "yildonumu", interests: ["yıldönümü", "evlilik", "ilişki"] },
  { id: "cocuklar-icin", interests: ["çocuk", "oyuncak", "eğlence"] },
  { id: "kendine-hediye", interests: ["kendine", "hediye", "lüks"] },
]

export function TopSellingProducts({ categoryId, limit = 5, showAllCategories = false }: TopSellingProductsProps) {
  const { user } = useAuth()
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([])
  const [fullGifts, setFullGifts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchTopSellingProducts()
  }, [categoryId, limit, user])

  const fetchTopSellingProducts = async () => {
    setLoading(true)
    try {
      // Try to fetch from the materialized view first
      let topSellingData: any[] = []
      let useView = false

      try {
        const { data: viewData, error: viewError } = await supabase.from("top_selling_by_category").select("*").limit(1)

        if (!viewError) {
          useView = true
          // Now fetch the actual data
          let query = supabase.from("top_selling_by_category").select("*")

          if (categoryId) {
            query = query.eq("category_id", categoryId)
          }

          query = query.order("rank_in_category", { ascending: true })

          if (!showAllCategories) {
            query = query.limit(limit)
          }

          const { data, error } = await query
          if (!error) {
            topSellingData = data || []
          }
        }
      } catch (viewError) {
        console.log("Materialized view not available, using fallback")
        useView = false
      }

      // Fallback to regular gifts if view doesn't work
      if (!useView || topSellingData.length === 0) {
        console.log("Using fallback: fetching regular gifts")

        let giftQuery = supabase.from("gifts").select(`
          *,
          profiles!gifts_submitted_by_fkey (username, avatar_url)
        `)

        // Apply category filtering for fallback
        if (categoryId) {
          const categoryFilters = {
            teknoloji: { interests: ["Teknoloji"] },
            "saglik-wellness": { interests: ["Sağlık & Wellness"] },
            muzik: { interests: ["Müzik"] },
            oyun: { interests: ["Oyun"] },
            "ev-yasam": { interests: ["Ev"] },
            moda: { interests: ["Moda"] },
            "kitap-kultur": { interests: ["Kitap", "Kültür"] },
            "yiyecek-icecek": { interests: ["Yiyecek & İçecek"] },
            "spor-fitness": { interests: ["Spor", "Fitness"] },
            fotograf: { interests: ["Fotoğrafçılık", "Sanat"] },
            "erkek-arkadas": { recipient: "Erkek Arkadaş" },
            "kiz-arkadas": { recipient: "Kız Arkadaş" },
            "anneler-gunu": { occasion: "Anneler Günü", recipient: "Anne" },
            "babalar-gunu": { occasion: "Babalar Günü", recipient: "Baba" },
            "sevgililer-gunu": { occasion: "Sevgililer Günü" },
            "yeni-is-kutlamasi": { occasion: ["Yeni İş", "Terfi"] },
            mezuniyet: { occasion: "Mezuniyet" },
            yildonumu: { occasion: "Yıldönümü" },
            "cocuklar-icin": { recipient: "Çocuk" },
            "kendine-hediye": { occasion: "Kendine Hediye" },
          }

          const filter = categoryFilters[categoryId as keyof typeof categoryFilters]
          if (filter) {
            if (filter.interests) {
              giftQuery = giftQuery.overlaps("interests", filter.interests)
            } else if (filter.recipient) {
              giftQuery = giftQuery.eq("recipient", filter.recipient)
            } else if (filter.occasion) {
              if (Array.isArray(filter.occasion)) {
                giftQuery = giftQuery.in("occasion", filter.occasion)
              } else {
                giftQuery = giftQuery.eq("occasion", filter.occasion)
              }
            }
          }
        }

        // Order by popularity score if available, otherwise by total_score
        try {
          giftQuery = giftQuery.order("popularity_score", { ascending: false })
        } catch {
          giftQuery = giftQuery.order("total_score", { ascending: false })
        }

        giftQuery = giftQuery.limit(showAllCategories ? 50 : limit)

        const { data: giftsData, error: giftsError } = await giftQuery

        if (giftsError) throw giftsError

        // Process gifts to match the expected format
        const processedTopProducts =
          giftsData?.map((gift, index) => ({
            gift_id: gift.id,
            category_id: categoryId || "trending",
            rank_in_category: index + 1,
            sales_count: gift.sales_count || 0,
            popularity_score: gift.popularity_score || gift.total_score,
            title: gift.title,
            image_url: gift.image_url,
            price_range: gift.price_range,
            total_score: gift.total_score,
            click_count: gift.click_count || 0,
          })) || []

        setTopProducts(processedTopProducts)

        // Process gifts for display
        const processedGifts =
          giftsData?.map((gift, index) => ({
            ...gift,
            user_vote: null, // Will be fetched separately if user is logged in
            comments_count: 0, // Will be fetched separately
            sales_count: gift.sales_count || 0,
            popularity_score: gift.popularity_score || gift.total_score,
            rank_in_category: index + 1,
            category_id: categoryId || "trending",
          })) || []

        setFullGifts(processedGifts)
        setLoading(false)
        return
      }

      // If we got here, we successfully used the materialized view
      setTopProducts(topSellingData)

      // Fetch full gift details for the top products
      if (topSellingData && topSellingData.length > 0) {
        const giftIds = topSellingData.map((p) => p.gift_id)

        const giftQuery = supabase
          .from("gifts")
          .select(`
        *,
        profiles!gifts_submitted_by_fkey (username, avatar_url)
      `)
          .in("id", giftIds)

        const { data: giftsData, error: giftsError } = await giftQuery

        if (giftsError) throw giftsError

        // Fetch user votes if logged in
        let userVotes: any[] = []
        if (user && giftsData && giftsData.length > 0) {
          const { data: votesData } = await supabase
            .from("votes")
            .select("gift_id, vote_type")
            .eq("user_id", user.id)
            .in("gift_id", giftIds)

          userVotes = votesData || []
        }

        // Fetch comment counts
        let commentCounts: any[] = []
        if (giftsData && giftsData.length > 0) {
          const { data: commentsData } = await supabase.from("comments").select("gift_id").in("gift_id", giftIds)

          commentCounts = giftIds.map((giftId) => ({
            gift_id: giftId,
            count: commentsData?.filter((c) => c.gift_id === giftId).length || 0,
          }))
        }

        // Merge data and maintain ranking order
        const processedGifts = topSellingData
          .map((topProduct) => {
            const gift = giftsData?.find((g) => g.id === topProduct.gift_id)
            const userVote = userVotes.find((v) => v.gift_id === topProduct.gift_id)
            const commentCount = commentCounts.find((c) => c.gift_id === topProduct.gift_id)

            return gift
              ? {
                  ...gift,
                  user_vote: userVote?.vote_type || null,
                  comments_count: commentCount?.count || 0,
                  sales_count: topProduct.sales_count || 0,
                  popularity_score: topProduct.popularity_score || 0,
                  rank_in_category: topProduct.rank_in_category,
                  category_id: topProduct.category_id,
                }
              : null
          })
          .filter(Boolean)

        setFullGifts(processedGifts)
      }
    } catch (error) {
      console.error("Error fetching top selling products:", error)
      setTopProducts([])
      setFullGifts([])
    } finally {
      setLoading(false)
    }
  }

  const trackClick = async (giftId: string, clickType: "view" | "affiliate_click" | "share") => {
    try {
      await supabase.from("gift_clicks").insert({
        gift_id: giftId,
        user_id: user?.id || null,
        click_type: clickType,
      })
    } catch (error) {
      console.error("Error tracking click:", error)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Star className="h-4 w-4 text-gray-400" />
      case 3:
        return <Star className="h-4 w-4 text-amber-600" />
      default:
        return <Fire className="h-4 w-4 text-orange-500" />
    }
  }

  const groupedByCategory = topProducts.reduce(
    (acc, product) => {
      if (!acc[product.category_id]) {
        acc[product.category_id] = []
      }
      acc[product.category_id].push(product)
      return acc
    },
    {} as Record<string, TopSellingProduct[]>,
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="bg-muted aspect-square rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (showAllCategories) {
    return (
      <div className="space-y-8">
        {Object.entries(groupedByCategory).map(([catId, products]) => (
          <div key={catId} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">{CATEGORY_NAMES[catId]} - En Çok Satanlar</h3>
                <Badge variant="secondary">{products.length} ürün</Badge>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/categories/${catId}`}>
                  Tümünü Gör
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {products.slice(0, 5).map((product) => {
                const gift = fullGifts.find((g) => g.id === product.gift_id)
                if (!gift) return null

                return (
                  <div key={product.gift_id} className="relative">
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      {getRankIcon(product.rank_in_category)}
                      <span className="text-xs font-medium">#{product.rank_in_category}</span>
                    </div>
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="secondary" className="text-xs">
                        {product.sales_count} satış
                      </Badge>
                    </div>
                    <div onClick={() => trackClick(product.gift_id, "view")}>
                      <GiftCard gift={gift} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {categoryId ? `${CATEGORY_NAMES[categoryId]} - En Çok Satanlar` : "En Çok Satan Hediyeler"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fullGifts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Henüz satış verisi bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fullGifts.slice(0, limit).map((gift) => {
              const topProduct = topProducts.find((p) => p.gift_id === gift.id)
              if (!topProduct) return null

              return (
                <div key={gift.id} className="relative">
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    {getRankIcon(topProduct.rank_in_category)}
                    <span className="text-xs font-medium">#{topProduct.rank_in_category}</span>
                  </div>
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="text-xs">
                      {topProduct.sales_count} satış
                    </Badge>
                  </div>
                  <div onClick={() => trackClick(gift.id, "view")}>
                    <GiftCard gift={gift} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
