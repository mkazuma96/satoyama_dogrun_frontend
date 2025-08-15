"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  User,
  Dog,
  Phone,
  Mail,
  AlertDialog
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Application {
  id: string
  user_id: string
  user_name: string
  user_email: string
  user_phone: string
  dog_name: string
  dog_breed?: string
  dog_weight?: string
  vaccine_certificate?: string
  request_date?: string
  request_time?: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
  approved_by?: string
  approved_at?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export default function ApplicationsManagement() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    today: 0
  })
  
  // 承認・却下ダイアログ用の状態
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'approve' | 'reject'>('approve')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  // データ取得
  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.admin.getApplications()
      setApplications(response)
      
      // 統計情報も取得
      const statsResponse = await apiClient.admin.getApplicationStats()
      setStats(statsResponse)
    } catch (err) {
      console.error('Failed to fetch applications:', err)
      setError('申請データの取得に失敗しました')
      toast.error('申請データの取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  // ステータスでフィルタリング
  const filteredApplications = applications.filter(app => {
    if (activeTab === 'pending') return app.status === 'pending'
    if (activeTab === 'approved') return app.status === 'approved'
    if (activeTab === 'rejected') return app.status === 'rejected'
    return true
  })

  // 承認処理
  const handleApprove = async () => {
    if (!selectedApplication) return

    try {
      await apiClient.admin.approveApplication(selectedApplication.id, {
        admin_notes: adminNotes
      })
      
      toast.success('申請を承認しました')
      setDialogOpen(false)
      setAdminNotes("")
      setSelectedApplication(null)
      
      // データを再取得
      await fetchApplications()
    } catch (err) {
      console.error('Failed to approve application:', err)
      toast.error('承認処理に失敗しました')
    }
  }

  // 却下処理
  const handleReject = async () => {
    if (!selectedApplication) return

    try {
      await apiClient.admin.rejectApplication(selectedApplication.id, {
        admin_notes: adminNotes,
        rejection_reason: rejectionReason
      })
      
      toast.success('申請を却下しました')
      setDialogOpen(false)
      setAdminNotes("")
      setRejectionReason("")
      setSelectedApplication(null)
      
      // データを再取得
      await fetchApplications()
    } catch (err) {
      console.error('Failed to reject application:', err)
      toast.error('却下処理に失敗しました')
    }
  }

  // ダイアログを開く
  const openDialog = (type: 'approve' | 'reject', application: Application) => {
    setDialogType(type)
    setSelectedApplication(application)
    setAdminNotes("")
    setRejectionReason("")
    setDialogOpen(true)
  }

  const renderApplicationCard = (application: Application) => (
    <Card key={application.id} className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-lg">{application.user_name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{application.user_email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{application.user_phone || '未登録'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">申請日</div>
            <div className="font-medium">
              {new Date(application.created_at).toLocaleDateString('ja-JP')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">愛犬情報</h4>
            <div className="bg-gray-50 p-3 rounded space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                <Dog className="h-4 w-4 text-gray-600" />
                <span className="font-medium">{application.dog_name}</span>
              </div>
              {application.dog_breed && <div>犬種: {application.dog_breed}</div>}
              {application.dog_weight && <div>体重: {application.dog_weight}kg</div>}
              {application.vaccine_certificate && (
                <div className="flex items-center space-x-2">
                  <span>ワクチン証明書:</span>
                  <Badge variant="outline" className="text-xs">
                    提出済み
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">利用希望</h4>
            <div className="bg-gray-50 p-3 rounded space-y-2 text-sm text-gray-600">
              {application.request_date && (
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{application.request_date}</span>
                </div>
              )}
              {application.request_time && <div>時間: {application.request_time}</div>}
            </div>
          </div>
        </div>

        {application.admin_notes && (
          <div className="mb-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2">管理者メモ</h4>
            <div className="bg-yellow-50 p-3 rounded text-sm text-gray-600">
              {application.admin_notes}
            </div>
          </div>
        )}

        {application.rejection_reason && (
          <div className="mb-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2">却下理由</h4>
            <div className="bg-red-50 p-3 rounded text-sm text-red-600">
              {application.rejection_reason}
            </div>
          </div>
        )}

        {application.status === "pending" && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Button
                onClick={() => openDialog('approve', application)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                承認
              </Button>
              <Button
                onClick={() => openDialog('reject', application)}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                却下
              </Button>
            </div>
          </div>
        )}

        {application.status === "approved" && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">承認済み</span>
            </div>
            {application.approved_at && (
              <span className="text-sm text-gray-500">
                承認日: {new Date(application.approved_at).toLocaleDateString('ja-JP')}
              </span>
            )}
          </div>
        )}

        {application.status === "rejected" && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">却下</span>
            </div>
            {application.approved_at && (
              <span className="text-sm text-gray-500">
                却下日: {new Date(application.approved_at).toLocaleDateString('ja-JP')}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            ページを再読み込み
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 md:ml-0 ml-20">
        <h1 className="text-2xl font-bold text-gray-900">利用申請管理</h1>
        <p className="text-gray-600 mt-1">ドッグラン利用申請の承認・却下を行います</p>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-600">総申請数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-gray-600">承認待ち</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-gray-600">承認済み</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-gray-600">却下</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
            <p className="text-xs text-gray-600">本日の申請</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "pending"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>承認待ち ({filteredApplications.filter(app => app.status === 'pending').length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "approved"
              ? "bg-white text-green-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>承認済み ({filteredApplications.filter(app => app.status === 'approved').length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("rejected")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "rejected"
              ? "bg-white text-red-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <XCircle className="h-4 w-4" />
            <span>却下 ({filteredApplications.filter(app => app.status === 'rejected').length})</span>
          </div>
        </button>
      </div>

      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              {activeTab === 'pending' && '承認待ちの申請はありません'}
              {activeTab === 'approved' && '承認済みの申請はありません'}
              {activeTab === 'rejected' && '却下した申請はありません'}
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map(renderApplicationCard)
        )}
      </div>

      {/* 承認・却下ダイアログ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'approve' ? '申請を承認' : '申請を却下'}
            </DialogTitle>
            <DialogDescription>
              {selectedApplication && (
                <div className="mt-2">
                  <p>申請者: {selectedApplication.user_name}</p>
                  <p>愛犬: {selectedApplication.dog_name}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="admin_notes">管理者メモ</Label>
              <Textarea
                id="admin_notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="メモを入力（任意）"
                className="h-20"
              />
            </div>
            {dialogType === 'reject' && (
              <div className="grid gap-2">
                <Label htmlFor="rejection_reason">却下理由</Label>
                <Textarea
                  id="rejection_reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="却下理由を入力"
                  className="h-20"
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              onClick={dialogType === 'approve' ? handleApprove : handleReject}
              className={dialogType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {dialogType === 'approve' ? '承認する' : '却下する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}