"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Loader2, Calendar, Tag, AlertCircle, FileText, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Incident } from "@/lib/types"

interface RecordDetailPageProps {
  recordId: string
}

export function RecordDetailPage({ recordId }: RecordDetailPageProps) {
  const [record, setRecord] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/records/${recordId}`)
        const result = await response.json()

        if (result.success) {
          setRecord(result.data)
        } else {
          setError(result.error || "Failed to fetch record")
        }
      } catch (err) {
        setError("Failed to fetch record")
        console.error("Failed to fetch record:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecord()
  }, [recordId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return "bg-blue-100 text-blue-700 border-blue-300"
    if (priority === 2) return "bg-green-100 text-green-700 border-green-300"
    if (priority === 3) return "bg-yellow-100 text-yellow-700 border-yellow-300"
    if (priority === 4) return "bg-orange-100 text-orange-700 border-orange-300"
    return "bg-red-100 text-red-700 border-red-300"
  }

  const getPriorityLabel = (priority: number) => {
    if (priority === 1) return "Low"
    if (priority === 2) return "Medium"
    if (priority === 3) return "High"
    if (priority === 4) return "Critical"
    return "Urgent"
  }

  if (loading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="text-slate-600">Loading record details...</p>
        </div>
      </div>
    )
  }

  if (error || !record) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Record Not Found</h2>
          <p className="text-slate-600 mb-6">{error || "The record you're looking for doesn't exist."}</p>
          <Link href="/records">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Records
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link href="/records">
          <Button variant="outline" size="sm" className="gap-2 rounded-full shadow-md hover:shadow-lg transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to Records
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Incident Details</h1>
          <p className="text-sm text-slate-500 mt-1">Record ID: {record.id}</p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary content - left section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          <Card className="bg-white border-2 border-slate-200 p-6 space-y-4 rounded-2xl shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-slate-600" />
                  <h2 className="text-lg font-bold text-slate-900">Summary</h2>
                </div>
                <p className="text-slate-700 leading-relaxed">{record.summary}</p>
              </div>
              <Badge className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getPriorityColor(record.priority)}`}>
                P{record.priority} - {getPriorityLabel(record.priority)}
              </Badge>
            </div>
          </Card>

          {/* Original Content Card */}
          <Card className="bg-white border-2 border-slate-200 p-6 space-y-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-slate-600" />
              <h3 className="font-bold text-slate-900">Original Content</h3>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{record.original}</p>
            </div>
          </Card>

          {/* Keywords Section */}
          {record.keywords && record.keywords.length > 0 && (
            <Card className="bg-white border-2 border-slate-200 p-6 space-y-4 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-900">Keywords</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {record.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 border-2 border-blue-300 rounded-full text-sm font-semibold shadow-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Sentiment Analysis */}
          {record.sentiment_analysis && (
            <Card className="bg-white border-2 border-slate-200 p-6 space-y-4 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-900">Sentiment Analysis</h3>
              </div>
              <p className="text-slate-700">{record.sentiment_analysis}</p>
            </Card>
          )}
        </div>

        {/* Metadata sidebar - right section */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 p-6 space-y-4 rounded-2xl shadow-lg">
            <h3 className="font-bold text-slate-900 text-lg">Incident Information</h3>

            <div className="space-y-4">
              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Incident Time</p>
                </div>
                <p className="text-sm text-slate-900 font-medium">{formatDate(record.time)}</p>
              </div>

              <div className="pb-4 border-b border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Service</p>
                <Badge className="bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 border-2 border-purple-300 rounded-full px-3 py-1">
                  {record.service}
                </Badge>
              </div>

              <div className="pb-4 border-b border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Source</p>
                <Badge className="bg-gradient-to-br from-green-100 to-green-200 text-green-700 border-2 border-green-300 rounded-full px-3 py-1">
                  {record.source}
                </Badge>
              </div>

              <div className="pb-4 border-b border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Subservice</p>
                <p className="text-sm text-slate-900 font-medium">{record.subservice}</p>
              </div>

              <div className="pb-4 border-b border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Category</p>
                <Badge className="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 border-2 border-amber-300 rounded-full px-3 py-1">
                  {record.category}
                </Badge>
              </div>

              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Created</p>
                </div>
                <p className="text-xs text-slate-600">{formatDate(record.created_at)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Last Updated</p>
                </div>
                <p className="text-xs text-slate-600">{formatDate(record.updated_at)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
