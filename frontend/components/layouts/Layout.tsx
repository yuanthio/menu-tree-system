"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layouts/Sidebar"
import { Breadcrumb, generateBreadcrumbs } from "@/components/layouts/Breadcrumb"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbs} className="mb-6" />
          
          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  )
}
