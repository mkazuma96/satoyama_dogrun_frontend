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
  Mail
} from "lucide-react"

export default function ApplicationsManagement() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [applications, setApplications] = useState({
    pending: [
      {
        id: 1,
        userName: "山田 太郎",
        userEmail: "yamada@example.com",
        userPhone: "090-1234-5678",
        applicationDate: "2024-12-15",
        postalCode: "123-4567",
        prefecture: "愛媛県",
        city: "今治市",
        address: "1-1-1",
        building: "サンプルマンション101号室",
        residenceHistory: "5年以上",
        dogName: "ポチ",
        dogBreed: "柴犬",
        dogWeight: 8.5,
        vaccineCertificate: "vaccine_cert_001.pdf",
        password: "********",
        requestDate: "2024-12-20",
        requestTime: "14:00-16:00",
        status: "pending"
      },
      {
        id: 2,
        userName: "佐藤 花子",
        userEmail: "sato@example.com",
        userPhone: "080-9876-5432",
        applicationDate: "2024-12-16",
        postalCode: "987-6543",
        prefecture: "愛媛県",
        city: "今治市",
        address: "2-2-2",
        building: "花子アパート202号室",
        residenceHistory: "3-5年",
        dogName: "ハナ",
        dogBreed: "ボーダーコリー",
        dogWeight: 18.0,
        vaccineCertificate: "vaccine_cert_002.pdf",
        password: "********",
        requestDate: "2024-12-21",
        requestTime: "10:00-12:00",
        status: "pending"
      }
    ],
    approved: [],
    rejected: []
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleApprove = (applicationId: number) => {
    setApplications(prev => {
      const application = prev.pending.find(app => app.id === applicationId)
      if (!application) return prev

      const approvedApplication = { ...application, status: "approved" }
      
      return {
        ...prev,
        pending: prev.pending.filter(app => app.id !== applicationId),
        approved: [...prev.approved, approvedApplication]
      }
    })

    console.log(`申請 ${applicationId} を承認しました`)
    alert(`申請 ${applicationId} を承認しました`)
  }

  const handleReject = (applicationId: number) => {
    setApplications(prev => {
      const application = prev.pending.find(app => app.id === applicationId)
      if (!application) return prev

      const rejectedApplication = { ...application, status: "rejected" }
      
      return {
        ...prev,
        pending: prev.pending.filter(app => app.id !== applicationId),
        rejected: [...prev.rejected, rejectedApplication]
      }
    })

    console.log(`申請 ${applicationId} を却下しました`)
    alert(`申請 ${applicationId} を却下しました`)
  }

  const renderApplicationCard = (application: any) => (
    <Card key={application.id} className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-lg">{application.userName}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{application.userEmail}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{application.userPhone}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">申請日</div>
            <div className="font-medium">{application.requestDate}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">申請者情報</h4>
            <div className="bg-gray-50 p-3 rounded space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>申請日: {application.applicationDate}</span>
              </div>
              <div>郵便番号: {application.postalCode}</div>
              <div>住所: {application.prefecture} {application.city} {application.address}</div>
              {application.building && <div>建物: {application.building}</div>}
              <div>居住歴: {application.residenceHistory}</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">愛犬情報</h4>
            <div className="bg-gray-50 p-3 rounded space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                <Dog className="h-4 w-4 text-gray-600" />
                <span className="font-medium">{application.dogName}</span>
              </div>
              <div>犬種: {application.dogBreed}</div>
              <div>体重: {application.dogWeight}kg</div>
              <div className="flex items-center space-x-2">
                <span>ワクチン証明書:</span>
                <Badge variant="outline" className="text-xs">
                  {application.vaccineCertificate}
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">利用希望</h4>
            <div className="bg-gray-50 p-3 rounded space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="font-medium">{application.requestDate}</span>
              </div>
              <div>時間: {application.requestTime}</div>
            </div>
          </div>
        </div>

        {application.status === "pending" && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Button
                onClick={() => handleApprove(application.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                承認
              </Button>
              <Button
                onClick={() => handleReject(application.id)}
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
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">承認済み</span>
          </div>
        )}

        {application.status === "rejected" && (
          <div className="flex items-center space-x-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">却下</span>
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
            <span>承認待ち ({applications.pending.length})</span>
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
            <span>当月承認 ({applications.approved.length})</span>
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
            <span>当月却下 ({applications.rejected.length})</span>
          </div>
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === "pending" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">承認待ちの申請</h2>
            {applications.pending.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  承認待ちの申請はありません
                </CardContent>
              </Card>
            ) : (
              applications.pending.map(renderApplicationCard)
            )}
          </div>
        )}

        {activeTab === "approved" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">当月承認済み</h2>
            {applications.approved.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  当月承認済みの申請はありません
                </CardContent>
              </Card>
            ) : (
              applications.approved.map(renderApplicationCard)
            )}
          </div>
        )}

        {activeTab === "rejected" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">当月却下</h2>
            {applications.rejected.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  当月却下の申請はありません
                </CardContent>
              </Card>
            ) : (
              applications.rejected.map(renderApplicationCard)
            )}
          </div>
        )}
      </div>
    </div>
  )
} 
