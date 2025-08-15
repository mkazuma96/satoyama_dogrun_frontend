"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { apiClient } from "../lib/api"

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
      // 管理者認証用APIクライアントを使用
      const response = await apiClient.admin.login({
        email,
        password
      });
      
      const { access_token, admin_user } = response;
      
      // ローカルストレージに保存
      try {
        localStorage.setItem("admin_token", access_token)
        localStorage.setItem("admin_user", JSON.stringify(admin_user))
      } catch (storageError) {
        console.error("Storage error:", storageError)
        // ストレージエラーが発生しても認証は成功とする
      }
      
      setIsAuthenticated(true)
      setUser(admin_user)
      return true
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
