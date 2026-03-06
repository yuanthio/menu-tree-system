import React from "react"
import Link from "next/link"
import { Folder } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)}>
      {/* Folder Icon */}
      <Link
        href="/"
        className="flex items-center hover:text-foreground transition-colors text-gray-400"
      >
        <Folder className="h-6 w-6 fill-current" />
      </Link>
      
      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="text-muted-foreground">/</span>
          {item.href ? (
            <Link
              href={item.href}
              className="flex items-center space-x-1 hover:text-foreground transition-colors text-muted-foreground"
            >
              <span>{item.label}</span>
            </Link>
          ) : (
            <div className="flex items-center space-x-1 text-foreground font-medium">
              <span>{item.label}</span>
            </div>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Helper function untuk generate breadcrumbs berdasarkan pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  
  // Mapping untuk halaman-halaman utama (tanpa icon)
  const pageMap: Record<string, { label: string }> = {
    systems: { label: "Systems" },
    "system-code": { label: "System Code" },
    properties: { label: "Properties" },
    menus: { label: "Menus" },
    "api-list": { label: "API List" },
  }
  
  segments.forEach((segment) => {
    if (pageMap[segment]) {
      breadcrumbs.push(pageMap[segment])
    } else {
      breadcrumbs.push({ label: segment.charAt(0).toUpperCase() + segment.slice(1) })
    }
  })
  
  return breadcrumbs
}
