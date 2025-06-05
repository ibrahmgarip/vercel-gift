"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

const OCCASIONS = [
  "Doğum Günü",
  "Yılbaşı",
  "Yıldönümü",
  "Düğün",
  "Mezuniyet",
  "Ev Hediyesi",
  "Bebek Shower",
  "Teşekkür",
  "Kendine Hediye",
  "Her Özel Gün",
]

const RECIPIENTS = [
  "Anne",
  "Baba",
  "Eş",
  "Arkadaş",
  "İş Arkadaşı",
  "Genç",
  "Çocuk",
  "Evcil Hayvan Sahibi",
  "Teknoloji Meraklısı",
  "Gurme",
  "Sanatçı",
  "Gezgin",
  "Herkes",
]

const INTERESTS = [
  "Teknoloji",
  "Sanat",
  "Müzik",
  "Spor",
  "Yemek Yapma",
  "Okuma",
  "Bahçecilik",
  "Moda",
  "Sağlık & Wellness",
  "Seyahat",
  "Oyun",
  "Fotoğrafçılık",
  "DIY",
  "Fitness",
  "Yiyecek & İçecek",
]

const PRICE_RANGES = ["₺100 Altı", "₺100-300", "₺300-500", "₺500-1000", "₺1000-2000", "₺2000+"]

interface Filters {
  occasion: string[]
  recipient: string[]
  interests: string[]
  priceRange: string[]
  sortBy: string
}

interface GiftFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function GiftFilters({ filters, onFiltersChange }: GiftFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const addFilter = (category: keyof Filters, value: string) => {
    if (category === "sortBy") {
      onFiltersChange({ ...filters, [category]: value })
    } else {
      const currentValues = filters[category] as string[]
      if (!currentValues.includes(value)) {
        onFiltersChange({
          ...filters,
          [category]: [...currentValues, value],
        })
      }
    }
  }

  const removeFilter = (category: keyof Filters, value: string) => {
    const currentValues = filters[category] as string[]
    onFiltersChange({
      ...filters,
      [category]: currentValues.filter((v) => v !== value),
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      occasion: [],
      recipient: [],
      interests: [],
      priceRange: [],
      sortBy: "trending",
    })
  }

  const hasActiveFilters = Object.values(filters).some((f) => (Array.isArray(f) ? f.length > 0 : f !== "trending"))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtreler</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Tümünü Temizle
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Daha Az" : "Daha Fazla"} Filtre
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.occasion.map((value) => (
            <Badge key={value} variant="secondary" className="gap-1">
              {value}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("occasion", value)} />
            </Badge>
          ))}
          {filters.recipient.map((value) => (
            <Badge key={value} variant="secondary" className="gap-1">
              {value}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("recipient", value)} />
            </Badge>
          ))}
          {filters.interests.map((value) => (
            <Badge key={value} variant="secondary" className="gap-1">
              {value}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("interests", value)} />
            </Badge>
          ))}
          {filters.priceRange.map((value) => (
            <Badge key={value} variant="secondary" className="gap-1">
              {value}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("priceRange", value)} />
            </Badge>
          ))}
        </div>
      )}

      {/* Sort By */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Sıralama:</span>
        <Select value={filters.sortBy} onValueChange={(value) => addFilter("sortBy", value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trending">Popüler</SelectItem>
            <SelectItem value="newest">En Yeni</SelectItem>
            <SelectItem value="top_rated">En Çok Beğenilen</SelectItem>
            <SelectItem value="price_low">Fiyat: Düşükten Yükseğe</SelectItem>
            <SelectItem value="price_high">Fiyat: Yüksekten Düşüğe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Özel Gün</h3>
          <Select onValueChange={(value) => addFilter("occasion", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Özel gün seçin" />
            </SelectTrigger>
            <SelectContent>
              {OCCASIONS.map((occasion) => (
                <SelectItem key={occasion} value={occasion}>
                  {occasion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Kime</h3>
          <Select onValueChange={(value) => addFilter("recipient", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Kişi seçin" />
            </SelectTrigger>
            <SelectContent>
              {RECIPIENTS.map((recipient) => (
                <SelectItem key={recipient} value={recipient}>
                  {recipient}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">İlgi Alanı</h3>
          <Select onValueChange={(value) => addFilter("interests", value)}>
            <SelectTrigger>
              <SelectValue placeholder="İlgi alanı seçin" />
            </SelectTrigger>
            <SelectContent>
              {INTERESTS.map((interest) => (
                <SelectItem key={interest} value={interest}>
                  {interest}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Fiyat Aralığı</h3>
          <Select onValueChange={(value) => addFilter("priceRange", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Fiyat seçin" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t">
          <div>
            <h3 className="text-sm font-medium mb-2">Popüler Özel Günler</h3>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.slice(0, 8).map((occasion) => (
                <Button
                  key={occasion}
                  variant="outline"
                  size="sm"
                  onClick={() => addFilter("occasion", occasion)}
                  className={filters.occasion.includes(occasion) ? "bg-primary text-primary-foreground" : ""}
                >
                  {occasion}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Popüler Kişiler</h3>
            <div className="flex flex-wrap gap-2">
              {RECIPIENTS.slice(0, 8).map((recipient) => (
                <Button
                  key={recipient}
                  variant="outline"
                  size="sm"
                  onClick={() => addFilter("recipient", recipient)}
                  className={filters.recipient.includes(recipient) ? "bg-primary text-primary-foreground" : ""}
                >
                  {recipient}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
