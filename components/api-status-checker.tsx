"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ApiStatus {
  status: "success" | "error" | "loading"
  message: string
  configured: boolean
  api_status?: any
  http_status?: number
}

export default function ApiStatusChecker() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({ status: "loading", message: "", configured: false })
  const [isVisible, setIsVisible] = useState(false)

  const checkApiStatus = async () => {
    setApiStatus({ status: "loading", message: "Checking API status...", configured: false })

    try {
      const response = await fetch("/api/tryon", { method: "GET" })
      const data = await response.json()
      setApiStatus(data)
    } catch (error) {
      setApiStatus({
        status: "error",
        message: "Failed to check API status",
        configured: false,
      })
    }
  }

  useEffect(() => {
    checkApiStatus()
  }, [])

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setIsVisible(true)} className="bg-white shadow-lg">
          <AlertCircle className="h-4 w-4 mr-2" />
          API Status
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Fashn.ai API Status</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {apiStatus.status === "loading" && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
              {apiStatus.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
              {apiStatus.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
              <span className="text-sm">{apiStatus.message}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">API Key:</span>
              <Badge variant={apiStatus.configured ? "default" : "destructive"}>
                {apiStatus.configured ? "Configured" : "Missing"}
              </Badge>
            </div>

            {apiStatus.http_status && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">HTTP Status:</span>
                <Badge variant={apiStatus.http_status === 200 ? "default" : "destructive"}>
                  {apiStatus.http_status}
                </Badge>
              </div>
            )}

            <Button size="sm" onClick={checkApiStatus} className="w-full">
              Refresh Status
            </Button>

            {!apiStatus.configured && (
              <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                <strong>Setup Required:</strong> Add your FASHN_API_KEY environment variable to enable virtual try-on
                functionality.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
