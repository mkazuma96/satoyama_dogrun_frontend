"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Calendar,
  MessageCircle,
  Heart
} from "lucide-react"

// 仮の投稿データ
const mockPosts = [
  {
    id: 1,
    title: "今日のドッグラン",
    content: "今日は天気が良くて、愛犬と楽しい時間を過ごしました。他のワンちゃんたちとも仲良く遊べて良かったです。",
    author: "田中 太郎",
    authorEmail: "tanaka@example.com",
    status: "approved",
    createdAt: "2024-03-20 14:30",
    likes: 15,
    comments: 8,
    imageUrl: "/placeholder.jpg",
    tags: ["日常", "楽しい"]
  },
  {
    id: 2,
    title: "新しいおもちゃ",
    content: "ドッグランで新しいおもちゃを買いました。愛犬がとても気に入ってくれて嬉しいです。",
    author: "佐藤 花子",
    authorEmail: "sato@example.com",
    status: "pending",
    createdAt: "2024-03-19 16:45",
    likes: 8,
    comments: 3,
    imageUrl: "/placeholder.jpg",
    tags: ["おもちゃ", "購入"]
  },
  {
    id: 3,
    title: "トレーニングの成果",
    content: "最近のトレーニングの成果が出てきて、愛犬がとても良い子になりました。",
    author: "鈴木 次郎",
    authorEmail: "suzuki@example.com",
    status: "reported",
    createdAt: "2024-03-18 10:15",
    likes: 22,
    comments: 12,
    imageUrl: "/placeholder.jpg",
    tags: ["トレーニング", "成果"]
  }
]

export default function PostsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("all")

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    const matchesTag = tagFilter === "all" || post.tags.includes(tagFilter)
    return matchesSearch && matchesStatus && matchesTag
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">承認済み</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">承認待ち</Badge>
      case "reported":
        return <Badge className="bg-red-100 text-red-800">報告あり</Badge>
      default:
        return <Badge variant="secondary">不明</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">投稿管理</h1>
          <p className="text-gray-600 mt-1">ユーザー投稿の一覧と管理</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Eye className="h-4 w-4 mr-2" />
          投稿プレビュー
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
                  placeholder="投稿タイトル、内容、投稿者で検索..."
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
                <option value="approved">承認済み</option>
                <option value="pending">承認待ち</option>
                <option value="reported">報告あり</option>
              </select>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべてのタグ</option>
                <option value="日常">日常</option>
                <option value="楽しい">楽しい</option>
                <option value="おもちゃ">おもちゃ</option>
                <option value="トレーニング">トレーニング</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                フィルター
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>投稿一覧</CardTitle>
          <CardDescription>
            {filteredPosts.length}件の投稿が見つかりました
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{post.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {post.author}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {post.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {post.likes}いいね
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {post.comments}コメント
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="text-right">
                      {getStatusBadge(post.status)}
                    </div>
                    <div className="flex flex-col space-y-2">
                      {post.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            承認
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                            <XCircle className="h-4 w-4 mr-1" />
                            却下
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
