"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  Plus,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Phone
} from "lucide-react"

// 仮のユーザーデータ
const mockUsers = [
  {
    id: 1,
    name: "田中 太郎",
    email: "tanaka@example.com",
    phone: "090-1234-5678",
    status: "active",
    registrationDate: "2024-01-15",
    dogs: 2,
    lastLogin: "2024-03-20"
  },
  {
    id: 2,
    name: "佐藤 花子",
    email: "sato@example.com",
    phone: "090-2345-6789",
    status: "pending",
    registrationDate: "2024-03-18",
    dogs: 1,
    lastLogin: "2024-03-19"
  },
  {
    id: 3,
    name: "鈴木 次郎",
    email: "suzuki@example.com",
    phone: "090-3456-7890",
    status: "suspended",
    registrationDate: "2024-02-10",
    dogs: 0,
    lastLogin: "2024-03-15"
  }
]

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">承認済み</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">承認待ち</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">停止中</Badge>
      default:
        return <Badge variant="secondary">不明</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
          <p className="text-gray-600 mt-1">登録ユーザーの一覧と管理</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          新規ユーザー追加
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="ユーザー名またはメールアドレスで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべてのステータス</option>
                <option value="active">承認済み</option>
                <option value="pending">承認待ち</option>
                <option value="suspended">停止中</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                フィルター
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>ユーザー一覧</CardTitle>
          <CardDescription>
            {filteredUsers.length}件のユーザーが見つかりました
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ユーザー</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ステータス</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">登録日</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">犬の数</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">最終ログイン</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {user.registrationDate}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {user.dogs}匹
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {user.lastLogin}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {user.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                              <UserCheck className="h-4 w-4 mr-1" />
                              承認
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                              <UserX className="h-4 w-4 mr-1" />
                              却下
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
