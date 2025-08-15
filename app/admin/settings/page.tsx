"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Shield, 
  FileText, 
  Activity, 
  Download, 
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { securityUtils } from "@/lib/security"
import { logger, LogLevel } from "@/lib/logger"
import { performanceMonitor } from "@/lib/performance"
import { AccessControl } from "@/lib/security"

export default function AdminSettings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("security")
  
  // セキュリティ設定
  const [securityConfig, setSecurityConfig] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    sessionTimeoutMinutes: 30,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 15,
  })

  // ログ設定
  const [logConfig, setLogConfig] = useState({
    level: LogLevel.INFO,
    maxEntries: 1000,
    enableConsole: true,
    enableStorage: true,
    enableRemote: false,
    remoteEndpoint: "",
  })

  // パフォーマンス設定
  const [performanceConfig, setPerformanceConfig] = useState({
    enableMonitoring: true,
    maxMetrics: 1000,
    enableResourceMonitoring: true,
    enableUserInteractionMonitoring: true,
  })

  // ログデータ
  const [logs, setLogs] = useState<any[]>([])
  const [performanceReport, setPerformanceReport] = useState<any>(null)
  const [performanceWarnings, setPerformanceWarnings] = useState<string[]>([])

  // アクセス権限チェック
  if (!AccessControl.isAdmin(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">アクセス拒否</h2>
          <p className="text-gray-600 mb-4">
            このページにアクセスするには管理者権限が必要です。
          </p>
        </div>
      </div>
    )
  }

  // 初期化
  useEffect(() => {
    loadLogs()
    loadPerformanceReport()
  }, [])

  // ログの読み込み
  const loadLogs = () => {
    const storedLogs = logger.getStoredLogs()
    setLogs(storedLogs.slice(-100)) // 最新100件
  }

  // パフォーマンスレポートの読み込み
  const loadPerformanceReport = () => {
    const report = performanceMonitor.generateReport()
    setPerformanceReport(report)
    
    const warnings = performanceMonitor.checkPerformanceWarnings()
    setPerformanceWarnings(warnings)
  }

  // セキュリティ設定の保存
  const saveSecurityConfig = () => {
    // 実際の実装では、APIを通じて設定を保存
    console.log('Security config saved:', securityConfig)
    alert('セキュリティ設定を保存しました')
  }

  // ログ設定の保存
  const saveLogConfig = () => {
    logger.updateConfig(logConfig)
    alert('ログ設定を保存しました')
  }

  // パフォーマンス設定の保存
  const savePerformanceConfig = () => {
    // 実際の実装では、APIを通じて設定を保存
    console.log('Performance config saved:', performanceConfig)
    alert('パフォーマンス設定を保存しました')
  }

  // ログのクリア
  const clearLogs = () => {
    if (confirm('すべてのログを削除しますか？この操作は取り消せません。')) {
      logger.clearStoredLogs()
      loadLogs()
      alert('ログをクリアしました')
    }
  }

  // ログのエクスポート
  const exportLogs = () => {
    const logData = logger.exportLogs()
    const blob = new Blob([logData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `satoyama-logs-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // パフォーマンスメトリクスのクリア
  const clearPerformanceMetrics = () => {
    if (confirm('パフォーマンスメトリクスをクリアしますか？')) {
      performanceMonitor.clearMetrics()
      loadPerformanceReport()
      alert('パフォーマンスメトリクスをクリアしました')
    }
  }

  // パフォーマンスメトリクスのエクスポート
  const exportPerformanceMetrics = () => {
    const metricsData = performanceMonitor.exportMetrics()
    const blob = new Blob([metricsData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `satoyama-performance-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">システム設定</h1>
        <p className="text-gray-600 mt-1">セキュリティ、ログ、パフォーマンスの設定を行います</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>セキュリティ</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>ログ管理</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>パフォーマンス</span>
          </TabsTrigger>
        </TabsList>

        {/* セキュリティ設定タブ */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>パスワードポリシー</span>
              </CardTitle>
              <CardDescription>
                パスワードの強度要件を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passwordMinLength">最小文字数</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securityConfig.passwordMinLength}
                    onChange={(e) => setSecurityConfig({
                      ...securityConfig,
                      passwordMinLength: parseInt(e.target.value)
                    })}
                    min="6"
                    max="20"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireUppercase">大文字を含む</Label>
                  <Switch
                    id="requireUppercase"
                    checked={securityConfig.passwordRequireUppercase}
                    onCheckedChange={(checked) => setSecurityConfig({
                      ...securityConfig,
                      passwordRequireUppercase: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireLowercase">小文字を含む</Label>
                  <Switch
                    id="requireLowercase"
                    checked={securityConfig.passwordRequireLowercase}
                    onCheckedChange={(checked) => setSecurityConfig({
                      ...securityConfig,
                      passwordRequireLowercase: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireNumbers">数字を含む</Label>
                  <Switch
                    id="requireNumbers"
                    checked={securityConfig.passwordRequireNumbers}
                    onCheckedChange={(checked) => setSecurityConfig({
                      ...securityConfig,
                      passwordRequireNumbers: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireSpecialChars">特殊文字を含む</Label>
                  <Switch
                    id="requireSpecialChars"
                    checked={securityConfig.passwordRequireSpecialChars}
                    onCheckedChange={(checked) => setSecurityConfig({
                      ...securityConfig,
                      passwordRequireSpecialChars: checked
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>セッション管理</CardTitle>
              <CardDescription>
                セッションの有効期限とログイン試行制限を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">セッションタイムアウト（分）</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securityConfig.sessionTimeoutMinutes}
                    onChange={(e) => setSecurityConfig({
                      ...securityConfig,
                      sessionTimeoutMinutes: parseInt(e.target.value)
                    })}
                    min="15"
                    max="480"
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxLoginAttempts">最大ログイン試行回数</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securityConfig.maxLoginAttempts}
                    onChange={(e) => setSecurityConfig({
                      ...securityConfig,
                      maxLoginAttempts: parseInt(e.target.value)
                    })}
                    min="3"
                    max="10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveSecurityConfig} className="bg-blue-600 hover:bg-blue-700">
              セキュリティ設定を保存
            </Button>
          </div>
        </TabsContent>

        {/* ログ管理タブ */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ログ設定</CardTitle>
              <CardDescription>
                ログの出力レベルと保存設定を管理します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logLevel">ログレベル</Label>
                  <select
                    id="logLevel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={logConfig.level}
                    onChange={(e) => setLogConfig({
                      ...logConfig,
                      level: parseInt(e.target.value)
                    })}
                  >
                    <option value={LogLevel.DEBUG}>DEBUG</option>
                    <option value={LogLevel.INFO}>INFO</option>
                    <option value={LogLevel.WARN}>WARN</option>
                    <option value={LogLevel.ERROR}>ERROR</option>
                    <option value={LogLevel.FATAL}>FATAL</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="maxEntries">最大ログエントリ数</Label>
                  <Input
                    id="maxEntries"
                    type="number"
                    value={logConfig.maxEntries}
                    onChange={(e) => setLogConfig({
                      ...logConfig,
                      maxEntries: parseInt(e.target.value)
                    })}
                    min="100"
                    max="10000"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableConsole">コンソールログ</Label>
                  <Switch
                    id="enableConsole"
                    checked={logConfig.enableConsole}
                    onCheckedChange={(checked) => setLogConfig({
                      ...logConfig,
                      enableConsole: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableStorage">ローカルストレージログ</Label>
                  <Switch
                    id="enableStorage"
                    checked={logConfig.enableStorage}
                    onCheckedChange={(checked) => setLogConfig({
                      ...logConfig,
                      enableStorage: checked
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ログ管理</CardTitle>
              <CardDescription>
                ログの表示、エクスポート、クリアを行います
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button onClick={loadLogs} variant="outline">
                  ログを更新
                </Button>
                <Button onClick={exportLogs} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  エクスポート
                </Button>
                <Button onClick={clearLogs} variant="outline" className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  クリア
                </Button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">ログがありません</p>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded border text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{log.message}</span>
                          <Badge variant={log.level >= LogLevel.ERROR ? "destructive" : "secondary"}>
                            {log.level === LogLevel.DEBUG && "DEBUG"}
                            {log.level === LogLevel.INFO && "INFO"}
                            {log.level === LogLevel.WARN && "WARN"}
                            {log.level === LogLevel.ERROR && "ERROR"}
                            {log.level === LogLevel.FATAL && "FATAL"}
                          </Badge>
                        </div>
                        <div className="text-gray-600 text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                          {log.userId && ` | User: ${log.userId}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveLogConfig} className="bg-blue-600 hover:bg-blue-700">
              ログ設定を保存
            </Button>
          </div>
        </TabsContent>

        {/* パフォーマンスタブ */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>パフォーマンス監視設定</CardTitle>
              <CardDescription>
                パフォーマンス監視の有効化と設定を行います
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableMonitoring">パフォーマンス監視</Label>
                  <Switch
                    id="enableMonitoring"
                    checked={performanceConfig.enableMonitoring}
                    onCheckedChange={(checked) => setPerformanceConfig({
                      ...performanceConfig,
                      enableMonitoring: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableResourceMonitoring">リソース監視</Label>
                  <Switch
                    id="enableResourceMonitoring"
                    checked={performanceConfig.enableResourceMonitoring}
                    onCheckedChange={(checked) => setPerformanceConfig({
                      ...performanceConfig,
                      enableResourceMonitoring: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableUserInteractionMonitoring">ユーザー操作監視</Label>
                  <Switch
                    id="enableUserInteractionMonitoring"
                    checked={performanceConfig.enableUserInteractionMonitoring}
                    onCheckedChange={(checked) => setPerformanceConfig({
                      ...performanceConfig,
                      enableUserInteractionMonitoring: checked
                    })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="maxMetrics">最大メトリクス数</Label>
                <Input
                  id="maxMetrics"
                  type="number"
                  value={performanceConfig.maxMetrics}
                  onChange={(e) => setPerformanceConfig({
                    ...performanceConfig,
                    maxMetrics: parseInt(e.target.value)
                  })}
                  min="100"
                  max="10000"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>パフォーマンスレポート</CardTitle>
              <CardDescription>
                現在のパフォーマンス状況を確認します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {performanceWarnings.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h4 className="font-medium text-yellow-800 mb-2">パフォーマンス警告</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {performanceWarnings.map((warning, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {performanceReport && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-md text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {performanceReport.summary.averagePageLoad}
                    </div>
                    <div className="text-sm text-blue-700">平均ページ読み込み時間 (ms)</div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-md text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {performanceReport.summary.averageApiResponse}
                    </div>
                    <div className="text-sm text-green-700">平均API応答時間 (ms)</div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-md text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {performanceReport.summary.totalMetrics}
                    </div>
                    <div className="text-sm text-purple-700">総メトリクス数</div>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button onClick={loadPerformanceReport} variant="outline">
                  レポートを更新
                </Button>
                <Button onClick={exportPerformanceMetrics} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  メトリクスをエクスポート
                </Button>
                <Button onClick={clearPerformanceMetrics} variant="outline" className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  メトリクスをクリア
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={savePerformanceConfig} className="bg-blue-600 hover:bg-blue-700">
              パフォーマンス設定を保存
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
