"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AuthProvider } from "@/contexts/AuthContext"
import AdminNavigation from "./navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('admin_access_token')
    
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login')
    } else if (token && pathname === '/admin/login') {
      router.push('/admin')
    } else {
      setIsAuthenticated(!!token)
    }
    setIsLoading(false)
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation />
        <div className="md:ml-64 p-4 md:p-6">
          {children}
        </div>
      </div>
    </AuthProvider>
  )
}