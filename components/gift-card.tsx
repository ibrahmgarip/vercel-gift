"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronUp, ChevronDown, MessageCircle, ExternalLink, Heart } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

type Gift = {
  id: string
  title: string
  description: string
  image_url: string | null
  price_range: string
  affiliate_url: string
  occasion: string
  recipient: string
  interests: string[]
  upvotes: number
  downvotes: number
  total_score: number
  created_at: string
  profiles?: {
    username: string
    avatar_url: string | null
  } | null
  user_vote?: "up" | "down" | null
  comments_count?: number
}

interface GiftCardProps {
  gift: Gift
  showFullDescription?: boolean
}

export function GiftCard({ gift, showFullDescription = false }: GiftCardProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isVoting, setIsVoting] = useState(false)
  const [currentVote, setCurrentVote] = useState(gift.user_vote)
  const [score, setScore] = useState(gift.total_score)
  const [imageError, setImageError] = useState(false)

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

    setIsVoting(true)

    try {
      // Ensure user profile exists before voting
      const profileExists = await ensureUserProfile()
      if (!profileExists) {
        throw new Error("Kullanıcı profili oluşturulamadı")
      }

      // If clicking the same vote, remove it
      if (currentVote === voteType) {
        const { error } = await supabase.from("votes").delete().eq("gift_id", gift.id).eq("user_id", user.id)

        if (error) throw error

        setCurrentVote(null)
        setScore((prev) => prev + (voteType === "up" ? -1 : 1))
      } else {
        // Insert or update vote
        const { error } = await supabase.from("votes").upsert({
          gift_id: gift.id,
          user_id: user.id,
          vote_type: voteType,
        })

        if (error) throw error

        const scoreDiff = currentVote
          ? voteType === "up"
            ? 2
            : -2 // Switching from down to up or vice versa
          : voteType === "up"
            ? 1
            : -1 // New vote

        setCurrentVote(voteType)
        setScore((prev) => prev + scoreDiff)
      }

      // Update gift score in database
      const { error: updateError } = await supabase.from("gifts").update({ total_score: score }).eq("id", gift.id)

      if (updateError) throw updateError
    } catch (error: any) {
      console.error("Error voting:", error)
      toast({
        title: "Hata",
        description: error.message || "Oyunuz kaydedilemedi. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  const handleAffiliateClick = () => {
    // Track click for analytics
    window.open(gift.affiliate_url, "_blank", "noopener,noreferrer")
  }

  const getImageSrc = () => {
    if (imageError || !gift.image_url) {
      return "/placeholder.svg?height=400&width=400"
    }
    return gift.image_url
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        <Image
          src={getImageSrc() || "/placeholder.svg"}
          alt={gift.title}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          crossOrigin="anonymous"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary">{gift.price_range}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight">
            <Link href={`/gifts/${gift.id}`} className="hover:text-primary">
              {gift.title}
            </Link>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={() => {
              /* Add to favorites */
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {showFullDescription ? gift.description : gift.description.slice(0, 100) + "..."}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="text-xs">
            {gift.occasion}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {gift.recipient}
          </Badge>
          {gift.interests.slice(0, 2).map((interest) => (
            <Badge key={interest} variant="outline" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={gift.profiles?.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {gift.profiles?.username?.charAt(0).toUpperCase() || "T"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{gift.profiles?.username || "Topluluk"}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote("up")}
              disabled={isVoting}
              className={currentVote === "up" ? "text-green-600" : ""}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[2rem] text-center">{score}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote("down")}
              disabled={isVoting}
              className={currentVote === "down" ? "text-red-600" : ""}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button onClick={handleAffiliateClick} className="flex-1">
          <ExternalLink className="h-4 w-4 mr-2" />
          Satın Al
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/gifts/${gift.id}`}>
            <MessageCircle className="h-4 w-4 mr-2" />
            {gift.comments_count || 0}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
