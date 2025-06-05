"use client"

import type { ReactNode } from "react"
import { GiftFilters } from "@/components/gift-filters"

interface Filters {
  occasion: string[]
  recipient: string[]
  interests: string[]
  priceRange: string[]
  sortBy: string
}

interface PageLayoutProps {
  children: ReactNode
  showFilters?: boolean
  filters?: Filters
  onFiltersChange?: (filters: Filters) => void
  className?: string
}

export function PageLayout({
  children,
  showFilters = true,
  filters,
  onFiltersChange,
  className = "",
}: PageLayoutProps) {
  if (!showFilters) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={`container py-8 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Filters */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            {filters && onFiltersChange && <GiftFilters filters={filters} onFiltersChange={onFiltersChange} />}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  )
}
