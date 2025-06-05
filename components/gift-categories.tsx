"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GiftCard } from "@/components/gift-card"
import { Smartphone, Heart, Music, Gamepad2, Home, Book, ChevronRight, Star, Gift, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

const CATEGORIES = [
  // Interest-based categories
  {
    id: "teknoloji",
    name: "Teknoloji",
    icon: Smartphone,
    color: "bg-blue-500",
    interests: ["Teknoloji"],
    description: "Akıllı cihazlar, gadget'lar ve teknoloji ürünleri",
    type: "interest",
  },
  {
    id: "saglik-wellness",
    name: "Sağlık & Wellness",
    icon: Heart,
    color: "bg-pink-500",
    interests: ["Sağlık & Wellness"],
    description: "Sağlıklı yaşam ve kişisel bakım ürünleri",
    type: "interest",
  },
  {
    id: "muzik",
    name: "Müzik",
    icon: Music,
    color: "bg-purple-500",
    interests: ["Müzik"],
    description: "Müzik aletleri, ses sistemleri ve müzik aksesuarları",
    type: "interest",
  },
  {
    id: "oyun",
    name: "Oyun & Eğlence",
    icon: Gamepad2,
    color: "bg-green-500",
    interests: ["Oyun"],
    description: "Video oyunları, board game'ler ve eğlence ürünleri",
    type: "interest",
  },
  {
    id: "ev-yasam",
    name: "Ev & Yaşam",
    icon: Home,
    color: "bg-orange-500",
    interests: ["Ev"],
    description: "Ev dekorasyonu, mutfak gereçleri ve yaşam ürünleri",
    type: "interest",
  },
  // Recipient/Occasion-based categories
  {
    id: "erkek-arkadas",
    name: "Erkek Arkadaş İçin",
    icon: Heart,
    color: "bg-blue-600",
    recipients: ["Erkek Arkadaş"],
    description: "Erkek arkadaşınız için özel hediye fikirleri",
    type: "recipient",
  },
  {
    id: "kiz-arkadas",
    name: "Kız Arkadaş İçin",
    icon: Heart,
    color: "bg-rose-500",
    recipients: ["Kız Arkadaş"],
    description: "Kız arkadaşınız için romantik hediye önerileri",
    type: "recipient",
  },
  {
    id: "anneler-gunu",
    name: "Anneler Günü",
    icon: Heart,
    color: "bg-pink-600",
    occasions: ["Anneler Günü"],
    recipients: ["Anne"],
    description: "Anneler günü için özel hediye fikirleri",
    type: "occasion",
  },
  {
    id: "yeni-is-kutlamasi",
    name: "Yeni İş Kutlaması",
    icon: Star,
    color: "bg-emerald-500",
    occasions: ["Yeni İş", "Terfi"],
    description: "Yeni iş ve kariyer başarıları için kutlama hediyeleri",
    type: "occasion",
  },
  {
    id: "babalar-gunu",
    name: "Babalar Günü",
    icon: Heart,
    color: "bg-slate-600",
    occasions: ["Babalar Günü"],
    recipients: ["Baba"],
    description: "Babalar günü için özel hediye önerileri",
    type: "occasion",
  },
  {
    id: "sevgililer-gunu",
    name: "Sevgililer Günü",
    icon: Heart,
    color: "bg-red-500",
    occasions: ["Sevgililer Günü"],
    recipients: ["Romantik Partner", "Eş"],
    description: "Sevgililer günü için romantik hediyeler",
    type: "occasion",
  },
  {
    id: "mezuniyet",
    name: "Mezuniyet Hediyesi",
    icon: Book,
    color: "bg-indigo-600",
    occasions: ["Mezuniyet"],
    recipients: ["Öğrenci", "Genç"],
    description: "Mezuniyet başarısı için özel hediyeler",
    type: "occasion",
  },
  {
    id: "yildonumu",
    name: "Yıldönümü",
    icon: Heart,
    color: "bg-purple-600",
    occasions: ["Yıldönümü"],
    recipients: ["Eş", "Romantik Partner"],
    description: "Yıldönümü kutlamaları için romantik hediyeler",
    type: "occasion",
  },
  {
    id: "cocuklar-icin",
    name: "Çocuklar İçin",
    icon: Gift,
    color: "bg-yellow-500",
    recipients: ["Çocuk"],
    description: "Çocuklar için eğlenceli ve eğitici hediyeler",
    type: "recipient",
  },
  {
    id: "kendine-hediye",
    name: "Kendine Hediye",
    icon: Star,
    color: "bg-teal-500",
    occasions: ["Kendine Hediye"],
    recipients: ["Herkes"],
    description: "Kendinizi şımartmak için özel ürünler",
    type: "occasion",
  },
]

interface GiftCategoriesProps {
  onCategorySelectionChange?: (isSelected: boolean) => void
}

export function GiftCategories({ onCategorySelectionChange }: GiftCategoriesProps) {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categoryGifts, setCategoryGifts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryGifts(selectedCategory)
    }
  }, [selectedCategory, user])

  const fetchCategoryGifts = async (categoryId: string) => {
    setLoading(true)
    const category = CATEGORIES.find((c) => c.id === categoryId)
    if (!category) return

    try {
      let query = supabase.from("gifts").select(`
      *,
      profiles!gifts_submitted_by_fkey (username, avatar_url)
    `)

      // Filter based on category type
      if (category.type === "interest" && category.interests) {
        query = query.overlaps("interests", category.interests)
      } else if (category.type === "recipient" && category.recipients) {
        query = query.in("recipient", category.recipients)
      } else if (category.type === "occasion" && category.occasions) {
        query = query.in("occasion", category.occasions)
        // Also filter by recipients if specified
        if (category.recipients) {
          query = query.in("recipient", category.recipients)
        }
      }

      query = query.order("total_score", { ascending: false })
      query = query.limit(6)

      const { data: giftsData, error } = await query

      if (error) throw error

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

      setCategoryGifts(processedGifts)
    } catch (error) {
      console.error("Error fetching category gifts:", error)
      setCategoryGifts([])
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
      setCategoryGifts([])
      onCategorySelectionChange?.(false)
    } else {
      setSelectedCategory(categoryId)
      onCategorySelectionChange?.(true)
    }
  }

  const closeCategory = () => {
    setSelectedCategory(null)
    setCategoryGifts([])
    onCategorySelectionChange?.(false)
  }

  return (
    <div className="space-y-6">
      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.id

          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary shadow-md" : ""
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-4 text-center">
                <div
                  className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selected Category Products */}
      {selectedCategory && (
        <div className="space-y-4 bg-muted/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">
                {CATEGORIES.find((c) => c.id === selectedCategory)?.name} Kategorisi
              </h3>
              <Badge variant="secondary">{categoryGifts.length} ürün</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/categories/${selectedCategory}`}>
                  Tümünü Gör
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={closeCategory}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          ) : categoryGifts.length === 0 ? (
            <div className="text-center py-8 bg-background rounded-lg">
              <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Bu kategoride henüz hediye bulunmamaktadır.</p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/submit">İlk Hediyeyi Siz Ekleyin</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryGifts.map((gift) => (
                <GiftCard key={gift.id} gift={gift} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
