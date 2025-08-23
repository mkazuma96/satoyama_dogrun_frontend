"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Shield } from "lucide-react"

export default function AdminLogin() {
  // 開発環境用のデフォルト値を設定
  const [email, setEmail] = useState("admin@satoyama-dogrun.com")
  const [password, setPassword] = useState("admin2025!")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
      const response = await fetch(`${apiUrl}/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "ログインに失敗しました")
      }

      // 管理者トークンを保存
      localStorage.setItem("admin_access_token", data.access_token)
      localStorage.setItem("admin_user", JSON.stringify(data.admin_user))
      
      toast.success("管理者としてログインしました")
      router.push("/admin")
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "ログインに失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  // デモ用ワンクリックログイン
  const handleDemoLogin = async () => {
    setIsLoading(true)

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
      const response = await fetch(`${apiUrl}/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: "admin@satoyama-dogrun.com", 
          password: "admin2025!" 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "デモログインに失敗しました")
      }

      // 管理者トークンを保存
      localStorage.setItem("admin_access_token", data.access_token)
      localStorage.setItem("admin_user", JSON.stringify(data.admin_user))
      
      toast.success("デモアカウントでログインしました")
      router.push("/admin")
    } catch (error: any) {
      console.error("Demo login error:", error)
      toast.error(error.message || "デモログインに失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">管理者ログイン</CardTitle>
          <CardDescription>
            里山ドッグラン管理システムにアクセス
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="パスワード"
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>
          
          {/* デモ用ワンクリックログインボタン */}
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "ログイン中..." : "デモアカウントでログイン"}
            </Button>
          </div>
          
          {/* 開発環境用の認証情報表示 */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm font-semibold text-yellow-800 mb-2">
              デモアカウント情報
            </p>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>メールアドレス: admin@satoyama-dogrun.com</p>
              <p>パスワード: admin2025!</p>
            </div>
            <p className="text-xs text-yellow-600 mt-2">
              ※ 上記のボタンをクリックすると、自動的にデモアカウントでログインします
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}