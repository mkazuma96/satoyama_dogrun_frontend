import { AuthProvider } from "@/contexts/AuthContext"
import AdminNavigation from "./navigation"

export const metadata = {
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
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation />
        {/* タブレット以上では左マージン、タブレット以下ではマージンなし */}
        <div className="md:ml-64 p-4 md:p-6">
          {children}
        </div>
      </div>
    </AuthProvider>
  )
}
