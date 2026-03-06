"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Code, 
  Settings, 
  Menu as MenuIcon, 
  List,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
}

const menuItems: MenuItem[] = [
  {
    id: "systems",
    label: "Systems",
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: "/systems"
  },
  {
    id: "system-code",
    label: "System Code",
    icon: <Code className="h-4 w-4" />,
    href: "/system-code"
  },
  {
    id: "properties",
    label: "Properties",
    icon: <Settings className="h-4 w-4" />,
    href: "/properties"
  },
  {
    id: "menus",
    label: "Menus",
    icon: <MenuIcon className="h-4 w-4" />,
    href: "/menus"
  },
  {
    id: "api-list",
    label: "API List",
    icon: <List className="h-4 w-4" />,
    href: "/api-list"
  }
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "relative bg-blue-800 rounded-r-4xl flex flex-col h-full border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white min-h-[60px]">
        <h2 className={cn(
          "text-lg font-semibold transition-all duration-300 overflow-hidden",
          collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}>
          Menu System
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator />

      {/* Menu Items */}
      <nav className="h-auto rounded-2xl space-y-2 bg-blue-700 m-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl text-sm font-medium transition-colors",
                collapsed 
                  ? "justify-center px-3 py-4" 
                  : "justify-start px-5 py-4",
                isActive 
                  ? "bg-white text-black [&>*:first-child]:text-blue-700" 
                  : "text-white hover:text-black hover:bg-accent [&>*:first-child]:hover:text-blue-700"
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className={cn(
                "shrink-0",
                collapsed ? "h-4 w-4" : "h-4 w-4"
              )}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
