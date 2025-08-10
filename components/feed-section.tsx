"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Heart, MessageCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

import { tags } from "@/lib/data"
import { getTagColor, getTagLabel } from "@/lib/utils"
import type { Post } from "@/lib/types"
import { UserStatus } from "@/lib/constants"

interface FeedSectionProps {
  userStatus: UserStatus
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeTag: string
  setActiveTag: (tag: string) => void
  recentPosts: Post[]
  setRecentPosts: (posts: Post[]) => void
  setShowCreatePostModal: (show: boolean) => void
  setSelectedPostIdForComment: (id: number | null) => void
  setShowCommentModal: (show: boolean) => void
}

export function FeedSection({
  userStatus,
  searchQuery,
  setSearchQuery,
  activeTag,
  setActiveTag,
  recentPosts,
  setRecentPosts,
  setShowCreatePostModal,
  setSelectedPostIdForComment,
  setShowCommentModal,
}: FeedSectionProps) {
  const handleLikeToggle = (postId: number) => {
    setRecentPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    )
  }

  const filteredPosts = recentPosts.filter((post) => {
    const matchesTag = activeTag === "all" || post.tag === activeTag
    const matchesSearch =
      searchQuery === "" ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.dog.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTag && matchesSearch
  })

  if (userStatus !== UserStatus.LoggedIn) {
    return (
      <div className="space-y-6 text-center">
        <Card
          className="border-asics-blue-200"
          style={{ backgroundColor: "rgba(0, 8, 148, 0.05)", borderColor: "rgba(0, 8, 148, 0.2)" }}
        >
          <CardContent className="p-6">
            <h2 className="text-xl font-heading mb-4" style={{ color: "rgb(0, 8, 148)" }}>
              投稿機能はログイン後に利用可能です
            </h2>
            <p className="text-sm text-gray-600 font-caption">
              みんなの投稿の閲覧や新規投稿は、ログインしてからご利用いただけます。
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading" style={{ color: "rgb(0, 8, 148)" }}>
          みんなの投稿
        </h2>
        <Button
          size="sm"
          className="text-white"
          style={{ backgroundColor: "rgb(0, 8, 148)" }}
          onClick={() => setShowCreatePostModal(true)}
        >
          <Camera className="h-4 w-4 mr-1" />
          投稿する
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          placeholder="投稿を検索..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asics-blue focus:border-asics-blue"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* Tag Filter */}
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2">
        {tags.map((tag) => (
          <Button
            key={tag.id}
            variant={activeTag === tag.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTag(tag.id)}
            className={`text-xs h-8 font-caption flex-shrink-0 ${activeTag === tag.id ? "text-white" : "border-asics-blue-200"}`}
            style={activeTag === tag.id ? { backgroundColor: "rgb(0, 8, 148)" } : { color: "rgb(0, 8, 148)" }}
          >
            {tag.label}
          </Button>
        ))}
      </div>

      {filteredPosts.map((post: Post) => (
        <Card key={post.id} className="border-asics-blue-100">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback style={{ backgroundColor: "rgba(0, 8, 148, 0.1)", color: "rgb(0, 8, 148)" }}>
                  {post.user[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-heading text-sm" style={{ color: "rgb(0, 8, 148)" }}>
                    {post.user}
                  </span>
                  <span className="text-xs text-gray-500 font-caption">& {post.dog}</span>
                  <span className="text-xs text-gray-400 font-caption">{post.time}</span>
                </div>
                <div className="mb-2">
                  <Badge className={`text-xs font-caption ${getTagColor(post.tag)}`}>
                    {getTagLabel(post.tag, tags)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-800 mb-3 font-body whitespace-pre-wrap break-words">
                  {renderContentWithHashtags(post.content)}
                </p>
                {post.image && (
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLikeToggle(post.id)}
                    className="flex items-center space-x-1 font-caption"
                    style={{ color: post.isLiked ? "rgb(255, 105, 180)" : "rgb(107, 114, 128)" }} // Pink for liked, gray for unliked
                  >
                    <Heart className="h-4 w-4" fill={post.isLiked ? "rgb(255, 105, 180)" : "none"} />{" "}
                    {/* Fill heart if liked */}
                    <span className="text-xs">{post.likes}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPostIdForComment(post.id)
                      setShowCommentModal(true)
                    }}
                    className="flex items-center space-x-1 text-gray-500 font-caption"
                    style={{ "&:hover": { color: "rgb(0, 8, 148)" } }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{post.comments > 0 ? `${post.comments}件のコメント` : "コメント"}</span>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
