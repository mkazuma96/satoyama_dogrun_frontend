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
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Clock
} from "lucide-react"

// 仮のイベントデータ
const mockEvents = [
  {
    id: 1,
    title: "春のドッグランフェス",
    description: "春の訪れを祝って、愛犬と一緒に楽しい時間を過ごしましょう。各種イベントやプレゼントもあります。",
    date: "2024-04-15",
    time: "10:00-16:00",
    location: "メインドッグラン",
    status: "upcoming",
    maxParticipants: 50,
    currentParticipants: 32,
    price: "無料",
    organizer: "里山ドッグラン運営",
    tags: ["春", "フェス", "無料"]
  },
  {
    id: 2,
    title: "犬のしつけ教室",
    description: "プロのトレーナーによる犬のしつけ教室です。基本的なコマンドから応用まで学べます。",
    date: "2024-03-25",
    time: "14:00-16:00",
    location: "トレーニングエリア",
    status: "ongoing",
    maxParticipants: 20,
    currentParticipants: 18,
    price: "2,000円",
    organizer: "ドッグトレーナー協会",
    tags: ["しつけ", "トレーニング", "有料"]
  },
  {
    id: 3,
    title: "夏の水遊び大会",
    description: "暑い夏を涼しく過ごそう！愛犬と一緒に水遊びを楽しむイベントです。",
    date: "2024-07-20",
    time: "13:00-17:00",
    location: "水遊びエリア",
    status: "draft",
    maxParticipants: 30,
    currentParticipants: 0,
    price: "500円",
    organizer: "里山ドッグラン運営",
    tags: ["夏", "水遊び", "有料"]
  }
]

export default function EventsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    const matchesDate = dateFilter === "all" || 
                       (dateFilter === "upcoming" && event.status === "upcoming") ||
                       (dateFilter === "ongoing" && event.status === "ongoing") ||
                       (dateFilter === "past" && event.status === "past")
    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">開催予定</Badge>
      case "ongoing":
        return <Badge className="bg-green-100 text-green-800">開催中</Badge>
      case "past":
        return <Badge className="bg-gray-100 text-gray-800">終了</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">下書き</Badge>
      default:
        return <Badge variant="secondary">不明</Badge>
    }
  }

  const getDateStatus = (date: string) => {
    const eventDate = new Date(date)
    const today = new Date()
    if (eventDate < today) return "past"
    if (eventDate.toDateString() === today.toDateString()) return "ongoing"
    return "upcoming"
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">イベント管理</h1>
          <p className="text-gray-600 mt-1">イベントの作成と管理</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          新規イベント作成
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
                  placeholder="イベントタイトル、説明で検索..."
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
                <option value="upcoming">開催予定</option>
                <option value="ongoing">開催中</option>
                <option value="past">終了</option>
                <option value="draft">下書き</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべての日付</option>
                <option value="upcoming">開催予定</option>
                <option value="ongoing">開催中</option>
                <option value="past">終了済み</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                フィルター
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {event.description}
                  </CardDescription>
                </div>
                <div className="ml-2">
                  {getStatusBadge(event.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Event Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {event.date} {event.time}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {event.currentParticipants}/{event.maxParticipants}人
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {event.price}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {event.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  主催: {event.organizer}
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    編集
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-1" />
                    削除
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Events Message */}
      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>条件に一致するイベントが見つかりません</p>
              <p className="text-sm">検索条件を変更するか、新しいイベントを作成してください</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
