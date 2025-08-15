"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  user: any | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any | null>(null)

  // 初期化時にローカルストレージから認証状態を復元
  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    const userData = localStorage.getItem("admin_user")
    
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // デモ用の簡単な認証（実際の実装ではAPI呼び出し）
      if (email === "admin@satoyama-dogrun.com" && password === "admin2025!") {
        const userData = { email, role: "admin" }
        const token = "demo_token_" + Date.now()
        
        // ローカルストレージに保存
        try {
          localStorage.setItem("admin_token", token)
          localStorage.setItem("admin_user", JSON.stringify(userData))
        } catch (storageError) {
          console.error("Storage error:", storageError)
          // ストレージエラーが発生しても認証は成功とする
        }
        
        setIsAuthenticated(true)
        setUser(userData)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
