import type React from "react"
import type { Metadata } from "next"
import { AdminNavigation } from "./navigation"

export const metadata: Metadata = {
  title: "里山ドッグラン 管理システム",
  description: "里山ドッグランの管理者向け管理システム",
  generator: 'v0.dev'
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Navigation */}
      <AdminNavigation />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  里山ドッグラン 管理システム
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">管理者</span>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
