"use client"

import { useEffect, useState } from "react"
import { GiftCard } from "@/components/gift-card"
import { GiftFilters } from "@/components/gift-filters"
import { TopSellingProducts } from "@/components/top-selling-products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Gift, Users, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"
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
  const { user } = useAuth()
  const [gifts, setGifts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Filters>({
    occasion: [],
    recipient: [],
    interests: [],
    priceRange: [],
    sortBy: "trending",
  })
  const [isCategorySelected, setIsCategorySelected] = useState(false)

  useEffect(() => {
    fetchGifts()
  }, [filters, user])

  const fetchGifts = async () => {
    setLoading(true)

    let query = supabase.from("gifts").select(`
      *,
      profiles!gifts_submitted_by_fkey (username, avatar_url)
    `)

    // Apply filters
    if (filters.occasion.length > 0) {
      query = query.in("occasion", filters.occasion)
    }
    if (filters.recipient.length > 0) {
      query = query.in("recipient", filters.recipient)
    }
    if (filters.interests.length > 0) {
      query = query.overlaps("interests", filters.interests)
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "top_rated":
        query = query.order("total_score", { ascending: false })
        break
      case "best_selling":
        try {
          query = query.order("sales_count", { ascending: false })
        } catch (e) {
          console.warn("sales_count column might not exist yet, falling back to total_score")
          query = query.order("total_score", { ascending: false })
        }
        break
      case "popularity":
        try {
          query = query.order("popularity_score", { ascending: false })
        } catch (e) {
          console.warn("popularity_score column might not exist yet, falling back to total_score")
          query = query.order("total_score", { ascending: false })
        }
        break
      default:
        query = query.order("total_score", { ascending: false })
    }

    const { data: giftsData, error } = await query.limit(20)

    if (error) {
      console.error("Error fetching gifts:", error)
      setGifts([])
    } else {
      // Fetch user votes separately if user is logged in
      let userVotes: any[] = []
      if (user && giftsData && giftsData.length > 0) {
        const giftIds = giftsData.map((gift) => gift.id)
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
        const giftIds = giftsData.map((gift) => gift.id)
        const { data: commentsData } = await supabase.from("comments").select("gift_id").in("gift_id", giftIds)

        // Count comments per gift
        commentCounts = giftIds.map((giftId) => ({
          gift_id: giftId,
          count: commentsData?.filter((c) => c.gift_id === giftId).length || 0,
        }))
      }

      // Process the data to include user votes and comment counts
      const processedGifts =
        giftsData?.map((gift) => {
          const userVote = userVotes.find((v) => v.gift_id === gift.id)
          const commentCount = commentCounts.find((c) => c.gift_id === gift.id)

          return {
            ...gift,
            user_vote: userVote?.vote_type || null,
            comments_count: commentCount?.count || 0,
          }
        }) || []

      setGifts(processedGifts)
    }

    setLoading(false)
  }

  const filteredGifts = gifts.filter(
    (gift) =>
      searchQuery === "" ||
      gift.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.interests.some((interest: string) => interest.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleCategorySelectionChange = (isSelected: boolean) => {
    setIsCategorySelected(isSelected)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container text-center mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Mükemmel Hediyeleri Keşfedin</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Her özel gün için benzersiz, topluluk tarafından önerilen hediyeler bulun. Dünya çapında binlerce hediye
            arayanın güvendiği platform.
          </p>

          <div className="flex items-center max-w-md mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Mükemmel hediyeyi ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="ml-2">Ara</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Topluluk Odaklı</h3>
              <p className="text-sm text-muted-foreground">Gerçek insanlardan gerçek öneriler</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Seçkin Kalite</h3>
              <p className="text-sm text-muted-foreground">Sadece en iyi hediyeler zirveye ulaşır</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Her Özel Gün İçin</h3>
              <p className="text-sm text-muted-foreground">Doğum günlerinden bayramlara ve aradaki her şey için</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Full Screen Layout */}
      <section className="py-8">
        {/* Categories Section - Full Width */}
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Kategoriler</h2>
            <Button variant="outline" asChild>
              <Link href="/categories">Tümünü Gör</Link>
            </Button>
          </div>
          <GiftCategories onCategorySelectionChange={handleCategorySelectionChange} />
        </div>

        {/* Filters and Content Layout */}
        <div className="container mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Filters */}
            {!isCategorySelected && (
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <GiftFilters filters={filters} onFiltersChange={setFilters} />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className={`${isCategorySelected ? "lg:col-span-4" : "lg:col-span-3"} space-y-12`}>
              {/* Top Selling Products Section */}
              <div>
                <TopSellingProducts showAllCategories={true} />
              </div>

              {/* Additional Gifts Section */}
              {filteredGifts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                      {filters.sortBy === "newest"
                        ? "En Yeni Hediyeler"
                        : filters.sortBy === "top_rated"
                          ? "En Çok Beğenilen Hediyeler"
                          : filters.sortBy === "best_selling"
                            ? "En Çok Satan Hediyeler"
                            : filters.sortBy === "popularity"
                              ? "En Popüler Hediyeler"
                              : "Diğer Hediyeler"}
                    </h2>
                    <p className="text-muted-foreground">{filteredGifts.length} hediye bulundu</p>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-muted aspect-square rounded-lg mb-4"></div>
                          <div className="space-y-2">
                            <div className="bg-muted h-4 rounded w-3/4"></div>
                            <div className="bg-muted h-3 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredGifts.length === 0 ? (
                    <div className="text-center py-12">
                      <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Hediye bulunamadı</h3>
                      <p className="text-muted-foreground mb-4">
                        Filtrelerinizi veya arama terimlerinizi değiştirmeyi deneyin
                      </p>
                      <Button
                        onClick={() =>
                          setFilters({
                            occasion: [],
                            recipient: [],
                            interests: [],
                            priceRange: [],
                            sortBy: "trending",
                          })
                        }
                      >
                        Filtreleri Temizle
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredGifts.map((gift) => (
                        <GiftCard key={gift.id} gift={gift} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
