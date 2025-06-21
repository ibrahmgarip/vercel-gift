"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ShoppingCart, TrendingDown, Clock, Check, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

type MarketplaceListing = {
  id: string
  marketplace_name: string
  price: number
  currency: string
  affiliate_url: string
  in_stock: boolean
  shipping_info: string | null
}

interface MarketplaceListingsProps {
  giftId: string
}

export function MarketplaceListings({ giftId }: MarketplaceListingsProps) {
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"price" | "marketplace">("price")
  const { toast } = useToast()

  useEffect(() => {
    fetchListings()
  }, [giftId])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select("*")
        .eq("gift_id", giftId)
        .order("price", { ascending: true })

      if (error) throw error

      setListings(data || [])
    } catch (error) {
      console.error("Error fetching marketplace listings:", error)
      toast({
        title: "Hata",
        description: "Pazar yeri listelemeleri yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const sortedListings = [...listings].sort((a, b) => {
    if (sortBy === "price") {
      return a.price - b.price
    } else {
      return a.marketplace_name.localeCompare(b.marketplace_name)
    }
  })

  const getBestDealBadge = (listing: MarketplaceListing) => {
    if (listings.length > 0 && listing.price === Math.min(...listings.map((l) => l.price))) {
      return (
        <Badge variant="secondary" className="absolute top-2 left-2 flex items-center gap-1">
          <TrendingDown className="h-3 w-3" />
          En İyi Fiyat
        </Badge>
      )
    }
    return null
  }

  const handleAffiliateClick = (url: string) => {
    // Track click for analytics
    window.open(url, "_blank", "noopener,noreferrer")
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Satıcılar Yükleniyor...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-muted rounded-md mb-2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (listings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Satıcılar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">Bu ürün için henüz satıcı bilgisi bulunmamaktadır.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Satıcılar
          </CardTitle>
          <Tabs defaultValue="price" className="w-[200px]" onValueChange={(value) => setSortBy(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="price">Fiyat</TabsTrigger>
              <TabsTrigger value="marketplace">Mağaza</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedListings.map((listing) => (
            <div key={listing.id} className="border rounded-lg p-3 relative hover:border-primary transition-colors">
              {getBestDealBadge(listing)}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{listing.marketplace_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      {listing.in_stock ? (
                        <>
                          <Check className="h-3 w-3 text-green-500" />
                          <span>Stokta</span>
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 text-red-500" />
                          <span>Stokta değil</span>
                        </>
                      )}
                    </div>
                    {listing.shipping_info && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{listing.shipping_info}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {listing.price.toFixed(2)} {listing.currency}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleAffiliateClick(listing.affiliate_url)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Satın Al
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
