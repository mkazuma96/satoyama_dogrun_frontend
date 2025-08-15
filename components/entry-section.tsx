"use client"

import { Camera, QrCode, ScanLine, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dog } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { UserStatus } from "@/lib/constants"
import type { DogProfile } from "@/lib/types"

interface EntrySectionProps {
  userStatus: UserStatus
  entryStep: string
  setEntryStep: (step: string) => void
  loggedInUserDogs: DogProfile[]
  selectedDogsForEntry: number[]
  setSelectedDogsForEntry: (dogs: number[]) => void
  isInDogRun: boolean
  setIsInDogRun: (inRun: boolean) => void
}

export function EntrySection({
  userStatus,
  entryStep,
  setEntryStep,
  loggedInUserDogs,
  selectedDogsForEntry,
  setSelectedDogsForEntry,
  isInDogRun,
  setIsInDogRun,
}: EntrySectionProps) {
  const handleDogSelection = (dogId: number) => {
    setSelectedDogsForEntry((prevSelected) => {
      if (prevSelected.includes(dogId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== dogId)
      } else {
        // If not selected, add it
        return [...prevSelected, dogId]
      }
    })
  }

  const handleEntryConfirm = () => {
    // Simulate entry confirmation logic here
    setIsInDogRun(true) // Set to true upon entering
    setEntryStep("entry_complete")
  }

  if (userStatus !== UserStatus.LoggedIn) {
    return (
      <div className="space-y-6 text-center">
        <Card
          className="border-asics-blue-200"
          style={{ backgroundColor: "rgba(0, 8, 148, 0.05)", borderColor: "rgba(0, 8, 148, 0.2)" }}
        >
          <CardContent className="p-6">
            <h2 className="text-xl font-heading mb-4" style={{ color: "rgb(0, 8, 148)" }}>
              入場機能はログイン後に利用可能です
            </h2>
            <p className="text-sm text-gray-600 font-caption">
              QRコードスキャンによる入場は、ログインしてからご利用いただけます。
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Entry Status Banner */}
      {userStatus === UserStatus.LoggedIn && (
        <Card
          className="bg-gradient-to-r from-asics-blue to-asics-blue-darker text-white border-0"
          style={{ background: "linear-gradient(135deg, rgb(0, 8, 148) 0%, rgb(0, 5, 120) 100%)" }}
        >
          <CardContent className="p-6 text-center">
            <div className="text-xl font-heading mb-1">{isInDogRun ? "入場中" : "退場中"}</div>
            <div className="text-sm opacity-90 font-caption">
              {isInDogRun ? "里山ドッグランをお楽しみください！" : "現在、ドッグランはご利用されていません。"}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conditional rendering based on isInDogRun and entryStep */}
      {isInDogRun ? (
        <div className="space-y-6 text-center">
          <Button
            onClick={() => {
              setIsInDogRun(false) // Set to false upon exiting
              setEntryStep("initial") // Go back to initial entry screen
            }}
            className="w-full text-white mt-2"
            style={{ backgroundColor: "rgb(255, 235, 0)", color: "rgb(0, 8, 148)" }}
          >
            退場する
          </Button>
          <p className="text-xs text-gray-500 font-caption mt-2">
            入場から1時間が経過すると自動的に退場扱いとなります。
          </p>
        </div>
      ) : (
        <>
          {entryStep === "initial" && (
            <>
              <div className="text-center">
                <h2 className="text-lg font-heading mb-2" style={{ color: "rgb(0, 8, 148)" }}>
                  入場手続き
                </h2>
                <p className="text-sm text-gray-600 font-caption">QRコードをスキャンして入場してください</p>
              </div>

              {/* QR Scanner */}
              <Card className="border-asics-blue-200" style={{ backgroundColor: "rgba(0, 8, 148, 0.05)" }}>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div
                      className="w-24 h-24 rounded-lg mx-auto flex items-center justify-center"
                      style={{ backgroundColor: "rgba(0, 8, 148, 0.1)" }}
                    >
                      <QrCode className="h-12 w-12" style={{ color: "rgb(0, 8, 148)" }} />
                    </div>
                    <div>
                      <h3 className="font-heading mb-2" style={{ color: "rgb(0, 8, 148)" }}>
                        QRコードスキャン
                      </h3>
                      <p className="text-sm mb-4 font-caption" style={{ color: "rgb(0, 8, 148)" }}>
                        入場ゲートのQRコードをスキャンしてください
                      </p>
                      <Button
                        onClick={() => setEntryStep("scanning")}
                        className="text-white"
                        style={{ backgroundColor: "rgb(0, 8, 148)" }}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        カメラを起動
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Entry Instructions */}
              <Card className="border-asics-blue-100">
                <CardHeader>
                  <CardTitle className="text-base font-heading" style={{ color: "rgb(0, 8, 148)" }}>
                    入場手順
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-caption font-medium text-white"
                      style={{ backgroundColor: "rgb(0, 8, 148)" }}
                    >
                      1
                    </div>
                    <div>
                      <p className="text-sm font-heading" style={{ color: "rgb(0, 8, 148)" }}>
                        QRコードをスキャン
                      </p>
                      <p className="text-xs text-gray-500 font-caption">入場ゲートのQRコードを読み取ります</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-caption font-medium text-white"
                      style={{ backgroundColor: "rgb(0, 8, 148)" }}
                    >
                      2
                    </div>
                    <div>
                      <p className="text-sm font-heading" style={{ color: "rgb(0, 8, 148)" }}>
                        愛犬情報の確認
                      </p>
                      <p className="text-xs text-gray-500 font-caption">登録された愛犬の情報を確認します</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-caption font-medium text-white"
                      style={{ backgroundColor: "rgb(0, 8, 148)" }}
                    >
                      3
                    </div>
                    <div>
                      <p className="text-sm font-heading" style={{ color: "rgb(0, 8, 148)" }}>
                        入場完了
                      </p>
                      <p className="text-xs text-gray-500 font-caption">入場が記録され、利用開始となります</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="border-yellow-200" style={{ backgroundColor: "rgba(255, 235, 0, 0.1)" }}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5" style={{ color: "rgb(255, 235, 0)" }} />
                    <div>
                      <h3 className="font-heading text-sm" style={{ color: "rgb(0, 8, 148)" }}>
                        困った時は
                      </h3>
                      <p className="text-sm mt-1 font-caption" style={{ color: "rgb(0, 8, 148)" }}>
                        QRコードが読み取れない場合は、受付スタッフにお声がけください
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {entryStep === "scanning" && (
            <div className="text-center space-y-4">
              <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white"></div>
                    <ScanLine className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-white animate-pulse" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-caption">
                  QRコードをフレーム内に合わせてください
                </div>
              </div>
              <Button
                onClick={() => setEntryStep("initial")}
                variant="outline"
                className="bg-white border-asics-blue-200"
                style={{ color: "rgb(0, 8, 148)" }}
              >
                キャンセル
              </Button>
              {/* デモ用スキャン完了ボタンを追加 */}
              <Button
                onClick={() => setEntryStep("dog_selection")}
                className="w-full text-white"
                style={{ backgroundColor: "rgb(84, 255, 148)", color: "rgb(0, 8, 148)" }}
              >
                スキャン完了 (デモ用)
              </Button>
            </div>
          )}

          {entryStep === "dog_selection" && (
            <>
              <div className="text-center">
                <h2 className="text-lg font-heading mb-2" style={{ color: "rgb(0, 8, 148)" }}>
                  愛犬情報の確認
                </h2>
                <p className="text-sm text-gray-600 font-caption">入場する愛犬を選択してください</p>
              </div>

              <div className="space-y-3">
                {loggedInUserDogs.map((user: DogProfile) => (
                  <Card
                    key={user.id}
                    className={`cursor-pointer transition-shadow border-asics-blue-100 ${
                      selectedDogsForEntry.includes(user.id) ? "border-2 border-asics-blue ring-2 ring-asics-blue" : ""
                    }`}
                  >
                    <CardContent className="p-4 flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedDogsForEntry.includes(user.id)}
                        onChange={() => handleDogSelection(user.id)}
                        className="h-5 w-5 text-asics-blue rounded focus:ring-asics-blue"
                      />
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "rgba(255, 235, 0, 0.2)" }}
                      >
                        <Dog className="h-6 w-6" style={{ color: "rgb(0, 8, 148)" }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-heading text-base" style={{ color: "rgb(0, 8, 148)" }}>
                            {user.name}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-sm border-asics-blue-200"
                            style={{ color: "rgb(0, 8, 148)" }}
                          >
                            {user.breed}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 font-caption">飼い主: {user.owner}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                onClick={handleEntryConfirm}
                className="w-full text-white"
                style={{ backgroundColor: "rgb(0, 8, 148)" }}
                disabled={selectedDogsForEntry.length === 0}
              >
                入場する
              </Button>
              <Button
                onClick={() => setEntryStep("initial")}
                variant="outline"
                className="w-full bg-white border-asics-blue-200"
                style={{ color: "rgb(0, 8, 148)" }}
              >
                戻る
              </Button>
            </>
          )}
        </>
      )}
    </div>
  )
}
