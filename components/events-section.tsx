"use client"

import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

import { upcomingEvents } from "@/lib/data"
import { generateDogrunCalendarDays, generateSalonCalendarDays, getDayStyle } from "@/lib/utils"
import { CalendarType, DayStatus, UserStatus } from "@/lib/constants"
import type { Event, CalendarDay } from "@/lib/types"

interface EventsSectionProps {
  userStatus: UserStatus
  activeCalendar: CalendarType
  setActiveCalendar: (type: CalendarType) => void
  displayDate: Date
  handlePreviousMonth: () => void
  handleNextMonth: () => void
}

export function EventsSection({
  userStatus,
  activeCalendar,
  setActiveCalendar,
  displayDate,
  handlePreviousMonth,
  handleNextMonth,
}: EventsSectionProps) {
  const currentYear = displayDate.getFullYear()
  const currentMonth = displayDate.getMonth() + 1 // getMonth() is 0-indexed

  const today = new Date()
  const currentMonthIndex = today.getMonth() // 0-indexed
  const nextMonthDate = new Date(today.getFullYear(), currentMonthIndex + 1)
  const nextMonthIndex = nextMonthDate.getMonth()
  const nextMonthYear = nextMonthDate.getFullYear()

  const isPreviousMonthDisabled =
    displayDate.getMonth() === currentMonthIndex && displayDate.getFullYear() === today.getFullYear()
  const isNextMonthDisabled = displayDate.getMonth() === nextMonthIndex && displayDate.getFullYear() === nextMonthYear

  const dogrunCalendarDays = generateDogrunCalendarDays(currentYear, currentMonth)
  const salonCalendarDays = generateSalonCalendarDays(currentYear, currentMonth)

  const currentCalendarDays: CalendarDay[] =
    activeCalendar === CalendarType.Dogrun ? dogrunCalendarDays : salonCalendarDays
  const currentCalendarLegend =
    activeCalendar === CalendarType.Dogrun ? (
      <>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: "rgba(0, 8, 148, 0.1)" }}></div>
          <span className="text-gray-600 font-caption">開館日</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: "rgba(144, 238, 144, 0.3)" }}></div>
          <span className="text-gray-600 font-caption">一部開館</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: "rgba(255, 235, 0, 0.3)" }}></div>
          <span className="text-gray-600 font-caption">休館日</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgb(255, 235, 0)" }}></div>
          <span className="text-gray-600 font-caption">イベント日</span>
        </div>
      </>
    ) : (
      <>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: "rgba(0, 8, 148, 0.1)" }}></div>
          <span className="text-gray-600 font-caption">営業日</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: "rgba(144, 238, 144, 0.3)" }}></div>
          <span className="text-gray-600 font-caption">一部営業時間</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: "rgba(255, 235, 0, 0.3)" }}></div>
          <span className="text-gray-600 font-caption">休業日</span>
        </div>
      </>
    )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading" style={{ color: "rgb(0, 8, 148)" }}>
          イベント・お知らせ
        </h2>
      </div>

      {/* Calendar Switch Buttons */}
      <div className="flex justify-center gap-2 mb-4">
        <Button
          variant={activeCalendar === CalendarType.Dogrun ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCalendar(CalendarType.Dogrun)}
          className={`text-xs h-8 font-caption ${activeCalendar === CalendarType.Dogrun ? "text-white" : "border-asics-blue-200"}`}
          style={
            activeCalendar === CalendarType.Dogrun ? { backgroundColor: "rgb(0, 8, 148)" } : { color: "rgb(0, 8, 148)" }
          }
        >
          里山ドッグラン
        </Button>
        <Button
          variant={activeCalendar === CalendarType.Salon ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCalendar(CalendarType.Salon)}
          className={`text-xs h-8 font-caption ${activeCalendar === CalendarType.Salon ? "text-white" : "border-asics-blue-200"}`}
          style={
            activeCalendar === CalendarType.Salon ? { backgroundColor: "rgb(0, 8, 148)" } : { color: "rgb(0, 8, 148)" }
          }
        >
          里山サロン
        </Button>
      </div>

      {/* Calendar */}
      <Card className="border-asics-blue-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              className={`text-asics-blue hover:bg-asics-blue-50 ${isPreviousMonthDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isPreviousMonthDisabled}
            >
              今月
            </Button>
            <CardTitle className="text-base flex items-center font-heading" style={{ color: "rgb(0, 8, 148)" }}>
              <Calendar className="h-5 w-5 mr-2" />
              {displayDate.toLocaleDateString("ja-JP", { year: "numeric", month: "long" })}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className={`text-asics-blue hover:bg-asics-blue-50 ${isNextMonthDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isNextMonthDisabled}
            >
              翌月
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 font-caption">
            <div className="font-medium text-gray-600">日</div>
            <div className="font-medium text-gray-600">月</div>
            <div className="font-medium text-gray-600">火</div>
            <div className="font-medium text-gray-600">水</div>
            <div className="font-medium text-gray-600">木</div>
            <div className="font-medium text-gray-600">金</div>
            <div className="font-medium text-gray-600">土</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {currentCalendarDays.map((day, index) => (
              <div
                key={index}
                className={`p-2 rounded flex flex-col items-center w-full aspect-[2/3] gap-1 ${day.status === DayStatus.Empty ? "" : "cursor-pointer"}`}
                style={getDayStyle(day.status)}
              >
                <span className="text-sm font-heading">{day.date}</span>
                {day.status === DayStatus.Limited && <span className="text-xs font-caption">{day.hours}</span>}
                {day.isEventDay && activeCalendar === CalendarType.Dogrun && (
                  <div
                    className="w-2 h-2 rounded-full mt-1"
                    style={{ backgroundColor: "rgb(255, 235, 0)" }}
                    title="イベント開催日"
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-caption">
            <div className="flex items-center space-x-4">{currentCalendarLegend}</div>
            <span className="text-gray-500">{displayDate.toLocaleDateString("ja-JP", { month: "long" })}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {upcomingEvents.map((event: Event) => (
          <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow border-asics-blue-100">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0, 8, 148, 0.1)" }}
                >
                  <Calendar className="h-6 w-6" style={{ color: "rgb(0, 8, 148)" }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-sm mb-1" style={{ color: "rgb(0, 8, 148)" }}>
                    {event.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 font-caption mb-2">
                    <span>{event.date}</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-600 font-caption">{event.participants}人参加予定</span>
                  </div>
                </div>
                {/* ログインしていない場合は参加ボタンを非表示にするか、ログインを促す */}
                {userStatus === UserStatus.LoggedIn ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-asics-blue-200 bg-transparent"
                    style={{ color: "rgb(0, 8, 148)" }}
                  >
                    参加する
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-asics-blue-200 bg-transparent opacity-50 cursor-not-allowed"
                    style={{ color: "rgb(0, 8, 148)" }}
                    disabled
                  >
                    ログインして参加
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
