"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, LogOut, Home, Users, Dog, FileText, Calendar, Settings } from "lucide-react"

export default function AdminNavigation() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/admin")
  }

  const navigationItems = [
    { name: "ダッシュボード", href: "/admin/dashboard", icon: Home },
    { name: "ユーザー管理", href: "/admin/users", icon: Users },
    { name: "犬の管理", href: "/admin/dogs", icon: Dog },
    { name: "投稿管理", href: "/admin/posts", icon: FileText },
    { name: "イベント管理", href: "/admin/events", icon: Calendar },
    { name: "設定", href: "/admin/settings", icon: Settings },
  ]

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50">
      {/* Logo and Title */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">
            里山ドッグラン
          </h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">管理システム</p>
      </div>

      {/* Navigation Menu - ログイン時のみ表示 */}
      {isAuthenticated && (
        <div className="p-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      )}

      {/* User Info and Logout - ログイン時のみ表示 */}
      {isAuthenticated && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="space-y-3">
            <div className="text-sm text-gray-500 px-2">
              {user?.email}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Home className="h-4 w-4" />
              <span>ユーザー側へ戻る</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>ログアウト</span>
            </Button>
          </div>
        </div>
      )}

      {/* ログインしていない場合のメッセージ */}
      {!isAuthenticated && (
        <div className="p-4">
          <div className="text-center text-gray-500 text-sm">
            <p>ログインしてください</p>
          </div>
        </div>
      )}
    </nav>
  )
}
