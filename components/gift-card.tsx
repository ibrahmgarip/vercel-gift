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
        <Link href={`/gifts/${gift.id}`}>
          <Image
            src={getImageSrc() || "/placeholder.svg"}
            alt={gift.title}
            fill
            className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onError={() => setImageError(true)}
            crossOrigin="anonymous"
          />
        </Link>
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
