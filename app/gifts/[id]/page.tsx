"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { MarketplaceListings } from "@/components/marketplace-listings"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronUp, ChevronDown, MessageCircle, Heart, Share2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function GiftDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [gift, setGift] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [voting, setVoting] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchGiftDetails()
      fetchComments()
    }
  }, [params.id, user])

  const fetchGiftDetails = async () => {
    const { data, error } = await supabase
      .from("gifts")
      .select(`
      *,
      profiles!gifts_submitted_by_fkey (username, avatar_url, points)
    `)
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching gift:", error)
      setGift(null)
    } else {
      // Fetch user vote separately if user is logged in
      let userVote = null
      if (user) {
        const { data: voteData } = await supabase
          .from("votes")
          .select("vote_type")
          .eq("gift_id", params.id)
          .eq("user_id", user.id)
          .single()

        userVote = voteData?.vote_type || null
      }

      setGift({
        ...data,
        user_vote: userVote,
      })
    }
    setLoading(false)
  }

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        profiles:user_id (username, avatar_url)
      `)
      .eq("gift_id", params.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching comments:", error)
    } else {
      setComments(data || [])
    }
  }

  // Helper function to ensure user profile exists
  const ensureUserProfile = async () => {
    if (!user) return false

    try {
      // First, check if the user profile exists
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single()

      // If profile exists, we're good
      if (profileData && !profileError) {
        return true
      }

      // If profile doesn't exist, try to create it
      const { error: createProfileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          username: user.user_metadata?.username || user.email?.split("@")[0] || "user",
          full_name:
            user.user_metadata?.full_name || user.user_metadata?.username || user.email?.split("@")[0] || "User",
          points: 0,
        },
        {
          onConflict: "id",
          ignoreDuplicates: true,
        },
      )

      if (createProfileError) {
        console.error("Error creating profile:", createProfileError)
        return false
      }

      return true
    } catch (error) {
      console.error("Error ensuring user profile:", error)
      return false
    }
  }

  const handleVote = async (voteType: "up" | "down") => {
    if (!user) {
      toast({
        title: "Giriş gerekli",
        description: "Hediyelere oy vermek için lütfen giriş yapın.",
        variant: "destructive",
      })
      return
    }

    setVoting(true)

    try {
      // Ensure user profile exists before voting
      const profileExists = await ensureUserProfile()
      if (!profileExists) {
        throw new Error("Kullanıcı profili oluşturulamadı")
      }

      const currentVote = gift.user_vote

      // If clicking the same vote, remove it
      if (currentVote === voteType) {
        const { error } = await supabase.from("votes").delete().eq("gift_id", gift.id).eq("user_id", user.id)

        if (error) throw error

        setGift((prev: any) => ({
          ...prev,
          user_vote: null,
          total_score: prev.total_score + (voteType === "up" ? -1 : 1),
        }))
      } else {
        // Check if a vote already exists
        const { data: existingVote } = await supabase
          .from("votes")
          .select("*")
          .eq("gift_id", gift.id)
          .eq("user_id", user.id)
          .maybeSingle()

        let error

        if (existingVote) {
          // Update existing vote
          const { error: updateError } = await supabase
            .from("votes")
            .update({ vote_type: voteType })
            .eq("gift_id", gift.id)
            .eq("user_id", user.id)

          error = updateError
        } else {
          // Insert new vote
          const { error: insertError } = await supabase.from("votes").insert({
            gift_id: gift.id,
            user_id: user.id,
            vote_type: voteType,
          })

          error = insertError
        }

        if (error) throw error

        const scoreDiff = currentVote
          ? voteType === "up"
            ? 2
            : -2 // Switching from down to up or vice versa
          : voteType === "up"
            ? 1
            : -1 // New vote

        setGift((prev: any) => ({
          ...prev,
          user_vote: voteType,
          total_score: prev.total_score + scoreDiff,
        }))
      }

      // Update gift score in database
      const { error: updateError } = await supabase
        .from("gifts")
        .update({ total_score: gift.total_score })
        .eq("id", gift.id)

      if (updateError) throw updateError
    } catch (error: any) {
      console.error("Error voting:", error)
      toast({
        title: "Hata",
        description: error.message || "Oyunuz kaydedilemedi. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setVoting(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Giriş gerekli",
        description: "Yorum yapmak için lütfen giriş yapın.",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Boş yorum",
        description: "Lütfen bir yorum yazın.",
        variant: "destructive",
      })
      return
    }

    setSubmittingComment(true)

    try {
      // Ensure user profile exists before commenting
      const profileExists = await ensureUserProfile()
      if (!profileExists) {
        throw new Error("Kullanıcı profili oluşturulamadı")
      }

      const { data, error } = await supabase
        .from("comments")
        .insert({
          gift_id: gift.id,
          user_id: user.id,
          content: newComment.trim(),
        })
        .select()
        .single()

      if (error) throw error

      // Award points to user
      const { error: pointsError } = await supabase
        .from("profiles")
        .update({ points: supabase.sql`points + 2` })
        .eq("id", user.id)

      if (pointsError) console.error("Error awarding points:", pointsError)

      // Fetch the profile data for the new comment
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single()

      if (profileError) console.error("Error fetching profile:", profileError)

      // Add the new comment to the list
      setComments([
        {
          ...data,
          profiles: profileData,
        },
        ...comments,
      ])

      setNewComment("")

      toast({
        title: "Yorum eklendi",
        description: "Yorumunuz başarıyla eklendi. 2 puan kazandınız!",
      })
    } catch (error: any) {
      console.error("Error submitting comment:", error)
      toast({
        title: "Hata",
        description: error.message || "Yorumunuz eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  const getImageSrc = () => {
    if (imageError || !gift?.image_url) {
      return "/placeholder.svg?height=600&width=600"
    }
    return gift.image_url
  }

  if (loading) {
    return (
      <PageLayout showFilters={false}>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded w-20"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!gift) {
    return (
      <PageLayout showFilters={false}>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Hediye bulunamadı</h1>
          <p className="text-muted-foreground mb-6">Bu hediye mevcut değil veya kaldırılmış olabilir.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ana Sayfaya Dön
            </Link>
          </Button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout showFilters={false}>
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tüm Hediyelere Dön
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Gift Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden border">
          <Image
            src={getImageSrc() || "/placeholder.svg"}
            alt={gift.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            crossOrigin="anonymous"
          />
        </div>

        {/* Gift Details */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold">{gift.title}</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("up")}
                disabled={voting}
                className={gift.user_vote === "up" ? "text-green-600" : ""}
              >
                <ChevronUp className="h-5 w-5" />
              </Button>
              <span className="text-lg font-medium min-w-[2rem] text-center">{gift.total_score}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("down")}
                disabled={voting}
                className={gift.user_vote === "down" ? "text-red-600" : ""}
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>
            <Badge variant="secondary">{gift.price_range}</Badge>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Açıklama</h2>
            <p className="text-muted-foreground">{gift.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline">{gift.occasion}</Badge>
            <Badge variant="outline">{gift.recipient}</Badge>
            {gift.interests.map((interest: string) => (
              <Badge key={interest} variant="outline">
                {interest}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={gift.profiles?.avatar_url || undefined} />
              <AvatarFallback>{gift.profiles?.username?.charAt(0).toUpperCase() || "T"}</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm text-muted-foreground">Ekleyen:</span>{" "}
              <span className="font-medium">{gift.profiles?.username || "Topluluk"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marketplace Listings */}
      <div className="mb-8">
        <MarketplaceListings giftId={gift.id} />
      </div>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Yorumlar ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="mb-6">
              <Textarea
                placeholder="Bu hediye hakkında düşüncelerinizi paylaşın..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2"
                rows={3}
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitComment} disabled={submittingComment}>
                  {submittingComment ? "Gönderiliyor..." : "Yorum Yap"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4 text-center mb-6">
              <p className="text-muted-foreground mb-2">Yorum yapmak için giriş yapın</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/auth">Giriş Yap</Link>
              </Button>
            </div>
          )}

          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium mb-1">Henüz yorum yok</h3>
              <p className="text-muted-foreground">İlk yorumu siz yapın!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id}>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                      <AvatarFallback>{comment.profiles?.username?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{comment.profiles?.username || "Anonim"}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      <p className="mt-1">{comment.content}</p>
                    </div>
                  </div>
                  {comments.indexOf(comment) < comments.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  )
}
