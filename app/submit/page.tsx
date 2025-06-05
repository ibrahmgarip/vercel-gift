"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { X, Plus } from "lucide-react"

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

export default function SubmitGiftPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    priceRange: "",
    affiliateUrl: "",
    occasion: "",
    recipient: "",
    interests: [] as string[],
  })

  const [newInterest, setNewInterest] = useState("")

  if (!user) {
    router.push("/auth")
    return null
  }

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest],
      })
    }
    setNewInterest("")
  }

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from("gifts")
        .insert({
          title: formData.title,
          description: formData.description,
          image_url: formData.imageUrl || null,
          price_range: formData.priceRange,
          affiliate_url: formData.affiliateUrl,
          occasion: formData.occasion,
          recipient: formData.recipient,
          interests: formData.interests,
          submitted_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      // Award points to user
      const { error: pointsError } = await supabase
        .from("profiles")
        .update({ points: supabase.sql`points + 10` })
        .eq("id", user.id)

      if (pointsError) console.error("Error awarding points:", pointsError)

      toast({
        title: "Hediye eklendi!",
        description: "Hediyeniz topluluğa eklendi. 10 puan kazandınız!",
      })

      router.push(`/gifts/${data.id}`)
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Hediye Fikri Ekle</CardTitle>
          <CardDescription>
            Keşfettiğiniz harika bir hediyeyi toplulukla paylaşın. Puan kazanın ve başkalarının mükemmel hediyeler
            bulmasına yardımcı olun!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Hediye Başlığı *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="örn., Kablosuz Gürültü Önleyici Kulaklık"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Bu hediyenin neden harika olduğunu, kimin için mükemmel olduğunu ve onu özel kılan şeyi açıklayın..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Görsel URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fiyat Aralığı *</Label>
                <Select
                  value={formData.priceRange}
                  onValueChange={(value) => setFormData({ ...formData, priceRange: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Fiyat aralığı seçin" />
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

              <div className="space-y-2">
                <Label htmlFor="affiliateUrl">Satın Alma Linki *</Label>
                <Input
                  id="affiliateUrl"
                  type="url"
                  value={formData.affiliateUrl}
                  onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                  placeholder="https://amazon.com/product-link"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Özel Gün *</Label>
                <Select
                  value={formData.occasion}
                  onValueChange={(value) => setFormData({ ...formData, occasion: value })}
                >
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

              <div className="space-y-2">
                <Label>Kime *</Label>
                <Select
                  value={formData.recipient}
                  onValueChange={(value) => setFormData({ ...formData, recipient: value })}
                >
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
            </div>

            <div className="space-y-2">
              <Label>İlgi Alanları & Kategoriler</Label>
              <div className="flex gap-2 mb-2">
                <Select value="" onValueChange={(value) => addInterest(value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="İlgi alanı ekle" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERESTS.filter((interest) => !formData.interests.includes(interest)).map((interest) => (
                      <SelectItem key={interest} value={interest}>
                        {interest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Özel ilgi alanı"
                    className="w-32"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => addInterest(newInterest)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="gap-1">
                    {interest}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeInterest(interest)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                İptal
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Gönderiliyor..." : "Hediye Ekle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
