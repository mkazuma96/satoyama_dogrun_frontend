"use client"

import { useEffect, useState } from "react"
import { LogIn, LogOut, Users, Dog, Clock, History, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { apiClient } from "@/lib/api"
import { QRScannerSimple } from "@/components/qr-scanner-simple"

interface EntryManagementProps {
  userDogs: any[]
}

export function EntryManagement({ userDogs }: EntryManagementProps) {
  const [isInPark, setIsInPark] = useState(false)
  const [selectedDogs, setSelectedDogs] = useState<string[]>([])
  const [currentVisitors, setCurrentVisitors] = useState<any>()
  const [entryHistory, setEntryHistory] = useState<any[]>([])
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    fetchCurrentStatus()
    fetchEntryHistory()
  }, [])

  const fetchCurrentStatus = async () => {
    try {
      // 現在の在場者情報を取得
      const visitors = await apiClient.getCurrentVisitors()
      setCurrentVisitors(visitors)
      
      // 自分の履歴から現在の状態を判定
      const history = await apiClient.getEntryHistory(1)
      if (history.length > 0 && history[0].action === "entry") {
        setIsInPark(true)
      }
    } catch (error) {
      console.error("状態取得エラー:", error)
    }
  }

  const fetchEntryHistory = async () => {
    try {
      const history = await apiClient.getEntryHistory(10)
      setEntryHistory(history)
    } catch (error) {
      console.error("履歴取得エラー:", error)
    }
  }

  const handleEntry = async () => {
    if (selectedDogs.length === 0) {
      toast.error("入場させる犬を選択してください")
      return
    }

    setLoading(true)
    try {
      const result = await apiClient.enterDogRun(selectedDogs)
      toast.success("入場処理が完了しました")
      setIsInPark(true)
      setSelectedDogs([])
      await fetchCurrentStatus()
      await fetchEntryHistory()
    } catch (error: any) {
      console.error("入場エラー:", error)
      toast.error(error.response?.data?.detail || "入場処理に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const handleExit = async () => {
    setLoading(true)
    try {
      const result = await apiClient.exitDogRun()
      toast.success(`退場しました（滞在時間: ${result.duration_minutes}分）`)
      setIsInPark(false)
      await fetchCurrentStatus()
      await fetchEntryHistory()
    } catch (error: any) {
      console.error("退場エラー:", error)
      toast.error(error.response?.data?.detail || "退場処理に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const toggleDogSelection = (dogId: string) => {
    setSelectedDogs(prev => 
      prev.includes(dogId) 
        ? prev.filter(id => id !== dogId)
        : [...prev, dogId]
    )
  }

  const handleQRScanSuccess = async () => {
    // 入場状態に変更
    setIsInPark(true)
    
    // 選択された犬をリセット
    setSelectedDogs([])
    
    // 現在の状態と履歴を更新
    await fetchCurrentStatus()
    await fetchEntryHistory()
  }

  return (
    <div className="space-y-6">
      {/* 現在の状態 */}
      <Card className="border-asics-blue-100">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center justify-between" style={{ color: "rgb(0, 8, 148)" }}>
            <span className="flex items-center">
              {isInPark ? <LogOut className="h-5 w-5 mr-2" /> : <LogIn className="h-5 w-5 mr-2" />}
              {isInPark ? "現在入場中" : "入場受付"}
            </span>
            {isInPark && (
              <Badge className="bg-green-500 text-white">IN PARK</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isInPark ? (
            <>
              {/* QRコード読み取りボタン */}
              <Button
                onClick={() => setShowQRScanner(true)}
                variant="outline"
                className="w-full"
                disabled={selectedDogs.length === 0 || loading}
              >
                <Camera className="h-4 w-4 mr-2" />
                QRコードを読み取る
              </Button>
              
              {/* 犬選択状態のメッセージ */}
              {selectedDogs.length === 0 ? (
                <div className="text-center py-2">
                  <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                    ⚠️ 入場する犬を選択してください
                  </p>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    ✅ {selectedDogs.length}頭の犬が選択されています
                  </p>
                </div>
              )}

              <Separator />

              {/* 犬の選択 */}
              <div>
                <p className="text-sm font-medium mb-3">入場する犬を選択</p>
                {userDogs.length > 0 ? (
                  <div className="space-y-2">
                    {userDogs.map((dog) => (
                      <div key={dog.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                        <Checkbox 
                          checked={selectedDogs.includes(dog.id)}
                          onCheckedChange={() => toggleDogSelection(dog.id)}
                          disabled={loading}
                        />
                        <Dog className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{dog.name}</span>
                        {dog.breed && <span className="text-xs text-gray-500">({dog.breed})</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">登録された犬がいません</p>
                )}
              </div>

              {/* 入場ボタン */}
              <Button
                onClick={handleEntry}
                disabled={selectedDogs.length === 0 || loading}
                className="w-full text-white"
                style={{ backgroundColor: "rgb(0, 8, 148)" }}
              >
                {loading ? "処理中..." : "入場する"}
              </Button>
            </>
          ) : (
            <>
              <div className="text-center py-4">
                <p className="text-lg mb-2">ドッグランをお楽しみください！</p>
                <p className="text-sm text-gray-600">退場時は下のボタンを押してください</p>
              </div>
              
              {/* 退場ボタン */}
              <Button
                onClick={handleExit}
                disabled={loading}
                className="w-full text-white bg-red-500 hover:bg-red-600"
              >
                {loading ? "処理中..." : "退場する"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* 現在の在場者 */}
      {currentVisitors && (
        <Card className="border-asics-blue-100">
          <CardHeader>
            <CardTitle className="text-base font-heading flex items-center" style={{ color: "rgb(0, 8, 148)" }}>
              <Users className="h-5 w-5 mr-2" />
              現在の在場者
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm font-medium">{currentVisitors.total_visitors}名</span>
                </div>
                <div className="flex items-center">
                  <Dog className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm font-medium">{currentVisitors.total_dogs}頭</span>
                </div>
              </div>
            </div>
            
            {currentVisitors.visitors.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {currentVisitors.visitors.map((visitor: any) => (
                  <div key={visitor.entry_id} className="flex items-center justify-between text-sm py-1">
                    <span>{visitor.user_name}</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(visitor.entry_time), "HH:mm", { locale: ja })}〜
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">現在利用者はいません</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* 利用履歴 */}
      <Card className="border-asics-blue-100">
        <CardHeader>
          <CardTitle 
            className="text-base font-heading flex items-center justify-between cursor-pointer"
            style={{ color: "rgb(0, 8, 148)" }}
            onClick={() => setShowHistory(!showHistory)}
          >
            <span className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              利用履歴
            </span>
            <span className="text-xs">{showHistory ? "▲" : "▼"}</span>
          </CardTitle>
        </CardHeader>
        {showHistory && (
          <CardContent>
            {entryHistory.length > 0 ? (
              <div className="space-y-2">
                {entryHistory.map((record) => (
                  <div key={record.id} className="flex items-center justify-between text-sm py-2 border-b">
                    <div className="flex items-center space-x-2">
                      {record.action === "entry" ? (
                        <LogIn className="h-4 w-4 text-green-500" />
                      ) : (
                        <LogOut className="h-4 w-4 text-red-500" />
                      )}
                      <span>{record.action === "entry" ? "入場" : "退場"}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(record.occurred_at), "MM/dd HH:mm", { locale: ja })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">利用履歴はありません</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* QRコードスキャナーモーダル */}
      <QRScannerSimple
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScanSuccess}
        selectedDogs={selectedDogs}
      />
    </div>
  )
}