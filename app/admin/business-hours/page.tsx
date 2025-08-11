"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Star,
  Save,
  Plus,
  Trash2
} from "lucide-react"

// 営業時間の型定義
interface BusinessHours {
  open: string
  close: string
}

// 日付の型定義
interface DaySchedule {
  date: number
  dayOfWeek: string
  businessHours: BusinessHours
  isOpen: boolean
  isEventDay: boolean
}

// 施設の型定義
interface Facility {
  id: string
  name: string
  color: string
  defaultHours: BusinessHours
  days: DaySchedule[]
}

export default function BusinessHoursManagement() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [facilities, setFacilities] = useState<Facility[]>([
    {
      id: "dogrun",
      name: "里山ドッグラン",
      color: "purple",
      defaultHours: { open: "09:00", close: "18:00" },
      days: []
    },
    {
      id: "salon",
      name: "里山サロン",
      color: "green",
      defaultHours: { open: "10:00", close: "19:00" },
      days: []
    }
  ])

  // 月の日数を取得
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  // 曜日を取得
  const getDayOfWeek = (date: Date) => {
    const days = ["日", "月", "火", "水", "木", "金", "土"]
    return days[date.getDay()]
  }

  // カレンダーの日付を生成
  const generateCalendarDays = (month: Date) => {
    const daysInMonth = getDaysInMonth(month)
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
    
    return Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(month.getFullYear(), month.getMonth(), index + 1)
      return {
        date: index + 1,
        dayOfWeek: getDayOfWeek(date),
        businessHours: { open: "09:00", close: "18:00" },
        isOpen: true,
        isEventDay: false
      }
    })
  }

  // 月を変更
  const changeMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
    
    // 新しい月の日付を生成
    const newDays = generateCalendarDays(newMonth)
    setFacilities(prev => prev.map(facility => ({
      ...facility,
      days: newDays.map(day => ({
        ...day,
        businessHours: facility.defaultHours
      }))
    })))
  }

  // 営業時間を更新
  const updateBusinessHours = (facilityId: string, date: number, field: 'open' | 'close', value: string) => {
    setFacilities(prev => prev.map(facility => {
      if (facility.id === facilityId) {
        return {
          ...facility,
          days: facility.days.map(day => {
            if (day.date === date) {
              return {
                ...day,
                businessHours: {
                  ...day.businessHours,
                  [field]: value
                }
              }
            }
            return day
          })
        }
      }
      return facility
    }))
  }

  // 営業状態を切り替え
  const toggleBusinessStatus = (facilityId: string, date: number) => {
    setFacilities(prev => prev.map(facility => {
      if (facility.id === facilityId) {
        return {
          ...facility,
          days: facility.days.map(day => {
            if (day.date === date) {
              return {
                ...day,
                isOpen: !day.isOpen
              }
            }
            return day
          })
        }
      }
      return facility
    }))
  }

  // イベント日を切り替え
  const toggleEventDay = (facilityId: string, date: number) => {
    setFacilities(prev => prev.map(facility => {
      if (facility.id === facilityId) {
        return {
          ...facility,
          days: facility.days.map(day => {
            if (day.date === date) {
              return {
                ...day,
                isEventDay: !day.isEventDay
              }
            }
            return day
          })
        }
      }
      return facility
    }))
  }

  // デフォルト営業時間を設定
  const setDefaultHours = (facilityId: string, hours: BusinessHours) => {
    setFacilities(prev => prev.map(facility => {
      if (facility.id === facilityId) {
        return {
          ...facility,
          defaultHours: hours,
          days: facility.days.map(day => ({
            ...day,
            businessHours: hours
          }))
        }
      }
      return facility
    }))
  }

  // 保存
  const handleSave = () => {
    // 実際の実装では、APIを呼び出してデータベースに保存
    console.log("営業時間を保存しました:", facilities)
    alert("営業時間を保存しました")
  }

  // 初期化時にカレンダーを生成
  useState(() => {
    const initialDays = generateCalendarDays(currentMonth)
    setFacilities(prev => prev.map(facility => ({
      ...facility,
      days: initialDays.map(day => ({
        ...day,
        businessHours: facility.defaultHours
      }))
    })))
  })

  const formatMonth = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">営業時間管理</h1>
          <p className="text-gray-600 mt-1">営業カレンダーの設定と管理</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          保存
        </Button>
      </div>

      {/* 本日の開館情報 */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <CardTitle>本日の開館情報</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">開館時間</div>
              <div className="text-xl font-bold text-gray-900">09:00</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">閉館時間</div>
              <div className="text-xl font-bold text-gray-900">18:00</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">営業状況</div>
              <div className={`text-lg font-bold ${
                facilities.some(f => f.days.some(d => d.date === new Date().getDate() && d.isOpen))
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {facilities.some(f => f.days.some(d => d.date === new Date().getDate() && d.isOpen))
                  ? '営業日'
                  : '休業日'
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 月選択 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">{formatMonth(currentMonth)}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 営業カレンダー */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {facilities.map((facility) => (
          <Card key={facility.id}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full bg-${facility.color}-500`}></div>
                <span>{facility.name}</span>
              </CardTitle>
              <CardDescription>
                デフォルト営業時間: {facility.defaultHours.open} - {facility.defaultHours.close}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* デフォルト営業時間設定 */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">デフォルト営業時間</h4>
                <div className="flex items-center space-x-2">
                  <Input
                    type="time"
                    value={facility.defaultHours.open}
                    onChange={(e) => setDefaultHours(facility.id, { ...facility.defaultHours, open: e.target.value })}
                    className="w-24"
                  />
                  <span>-</span>
                  <Input
                    type="time"
                    value={facility.defaultHours.close}
                    onChange={(e) => setDefaultHours(facility.id, { ...facility.defaultHours, close: e.target.value })}
                    className="w-24"
                  />
                </div>
              </div>

              {/* カレンダー */}
              <div className="grid grid-cols-7 gap-1">
                {/* 曜日ヘッダー */}
                {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}

                {/* 日付セル */}
                {facility.days.map((day) => (
                                     <div
                     key={day.date}
                     className={`p-3 border rounded-lg text-center text-sm min-h-[140px] ${
                       day.isOpen 
                         ? day.isEventDay 
                           ? 'bg-yellow-100 border-yellow-300' 
                           : 'bg-gray-100 border-gray-300'
                         : 'bg-yellow-200 border-yellow-400'
                     }`}
                   >
                    <div className="font-medium mb-1">{day.date}</div>
                                         {day.isOpen && (
                       <div className="text-xs space-y-1">
                         <div className="flex items-center justify-center space-x-1 mb-1">
                           <Clock className="h-3 w-3" />
                           <span className="text-xs font-medium">営業時間</span>
                         </div>
                         <div className="space-y-1">
                           <div className="flex items-center justify-center space-x-1">
                             <Input
                               type="time"
                               value={day.businessHours.open}
                               onChange={(e) => updateBusinessHours(facility.id, day.date, 'open', e.target.value)}
                               className="w-16 h-6 text-xs p-1 border-gray-300"
                             />
                             <span className="text-xs text-gray-500">-</span>
                             <Input
                               type="time"
                               value={day.businessHours.close}
                               onChange={(e) => updateBusinessHours(facility.id, day.date, 'close', e.target.value)}
                               className="w-16 h-6 text-xs p-1 border-gray-300"
                             />
                           </div>
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => setDefaultHours(facility.id, facility.defaultHours)}
                             className="w-full text-xs mt-1 h-6"
                           >
                             デフォルトに戻す
                           </Button>
                         </div>
                       </div>
                     )}
                    {!day.isOpen && (
                      <div className="text-xs text-yellow-700">休業</div>
                    )}
                    {day.isEventDay && (
                      <div className="mt-1">
                        <Star className="h-3 w-3 text-yellow-600 mx-auto" />
                      </div>
                    )}
                    
                                         {/* 操作ボタン */}
                     <div className="mt-2 space-y-1">
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => {
                           setFacilities(prev => prev.map(f => {
                             if (f.id === facility.id) {
                               return {
                                 ...f,
                                 days: f.days.map(d => {
                                   if (d.date === day.date) {
                                     return { ...d, isOpen: !d.isOpen }
                                   }
                                   return d
                                 })
                               }
                             }
                             return f
                           }))
                         }}
                         className={`w-full text-xs ${
                           day.isOpen 
                             ? 'text-red-600 border-red-600 hover:bg-red-50' 
                             : 'text-green-600 border-green-600 hover:bg-green-50'
                         }`}
                       >
                         {day.isOpen ? '休業日にする' : '営業日にする'}
                       </Button>
                     </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


    </div>
  )
}
