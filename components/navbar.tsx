"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Gift, Plus, User, LogOut, Search, Heart, Package, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input" // Assuming Input is for the search bar

export function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl w-full flex h-16 items-center justify-between px-4">
        {/* Colorful Top Bar - Placeholder divs for colors */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-orange-500"></div>
          <div className="flex-1 bg-green-700"></div>
          <div className="flex-1 bg-teal-500"></div>
          <div className="flex-1 bg-pink-500"></div>
          <div className="flex-1 bg-orange-300"></div>
          <div className="flex-1 bg-blue-300"></div>
        </div>

        {/* Main Header Section */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            {/* Placeholder for Uncommon Goods logo */}
            <span className="text-green-700 text-2xl font-serif">uncommon goods</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-center flex-1 max-w-md mx-4 border rounded-full overflow-hidden bg-gray-100">
          <div className="flex items-center w-full px-3 py-1">
            <Search className="h-4 w-4 text-gray-500 mr-2" />
            <Input
              placeholder="search | gifts for teenage niece, she likes science, games, art"
              className="w-full border-none focus:ring-0 focus-visible:ring-0 bg-transparent text-sm"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Sign in
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Wish list
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Gift className="h-4 w-4" />
            Gift finder
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ShoppingCart className="h-4 w-4" />
            Cart
          </Button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="mx-auto max-w-7xl w-full flex items-center justify-center h-10 text-sm border-t">
        <nav className="flex items-center gap-6">
          <Link href="#" className="hover:underline">
            new
          </Link>
          <Link href="#" className="hover:underline">
            father's day
          </Link>
          <Link href="#" className="hover:underline">
            gifts
          </Link>
          <Link href="#" className="hover:underline">
            interests
          </Link>
          <Link href="#" className="hover:underline">
            birthday
          </Link>
          <Link href="#" className="hover:underline">
            men
          </Link>
          <Link href="#" className="hover:underline">
            women
          </Link>
          <Link href="#" className="hover:underline">
            kids
          </Link>
          <Link href="#" className="hover:underline">
            kitchen & bar
          </Link>
          <Link href="#" className="hover:underline">
            home & garden
          </Link>
          <Link href="#" className="hover:underline">
            jewelry
          </Link>
          <Link href="#" className="hover:underline">
            experiences
          </Link>
          <Link href="#" className="hover:underline">
            corporate gifts
          </Link>
          <Link href="#" className="hover:underline">
            sale
          </Link>
        </nav>
      </div>
    </header>
  )
}
