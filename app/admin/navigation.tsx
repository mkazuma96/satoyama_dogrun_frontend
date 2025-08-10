"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Users, 
  Dog, 
  FileText, 
  Calendar, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

const navigation = [
  { name: "ダッシュボード", href: "/admin", icon: LayoutDashboard },
  { name: "ユーザー管理", href: "/admin/users", icon: Users },
  { name: "犬の管理", href: "/admin/dogs", icon: Dog },
  { name: "投稿管理", href: "/admin/posts", icon: FileText },
  { name: "イベント管理", href: "/admin/events", icon: Calendar },
  { name: "お知らせ管理", href: "/admin/notices", icon: Bell },
  { name: "システム設定", href: "/admin/settings", icon: Settings },
]

export function AdminNavigation() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-gray-900">管理メニュー</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                collapsed ? "mx-auto" : "mr-3"
              )} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors",
            collapsed ? "justify-center" : ""
          )}
        >
          <ChevronLeft className={cn(
            "h-5 w-5",
            collapsed ? "mx-auto" : "mr-3"
          )} />
          {!collapsed && <span>ユーザー向けアプリに戻る</span>}
        </Link>
      </div>
    </div>
  )
}
