"use client"

import { useState } from "react"
import { RecordsTable } from "@/components/records/records-table"
import { RecordsFilters } from "@/components/records/records-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, Save, FileText, CheckCircle2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface Pattern {
  id?: string
  tempId?: string
  title: string
  description: string
  priority: number
  frequency: number
  filters: any
  time_range?: {
    start: string
    end: string
  }
  incident_ids?: string[]
  isTemporary?: boolean
}

export function RecordsPage() {
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [isCreatingPatterns, setIsCreatingPatterns] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [createdPatterns, setCreatedPatterns] = useState<Pattern[]>([])
  const [savingPatternIds, setSavingPatternIds] = useState<Set<string>>(new Set())

  const handleExplorePatterns = async () => {
    setIsCreatingPatterns(true)
    try {
      // First, fetch all incident IDs based on current filters
      const params = new URLSearchParams()
      
      if (filters) {
        Object.entries(filters).forEach(([key, values]) => {
          if (values.length > 0) {
            params.append(key, values.join(','))
          }
        })
      }
      
      // Set a large page size to get all matching incidents
      params.append('pageSize', '10000')
      params.append('page', '1')
      
      const recordsResponse = await fetch(`/api/records?${params}`)
      const recordsResult = await recordsResponse.json()
      
      if (!recordsResult.success || !recordsResult.data?.length) {
        alert('No records found with the current filters')
        return
      }
      
      // Extract incident IDs
      const incidentIds = recordsResult.data.map((incident: any) => incident.id)
      
      // Call the clustering API without saving
      const clusterResponse = await fetch('/api/patterns/cluster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incident_ids: incidentIds,
          preview: true, // Flag to indicate we want preview only
        }),
      })
      
      const clusterResult = await clusterResponse.json()
      
      if (clusterResult.success && clusterResult.patterns) {
        // Mark patterns as temporary (not yet saved)
        const tempPatterns = clusterResult.patterns.map((p: any, idx: number) => ({
          ...p,
          tempId: `temp-${idx}`,
          isTemporary: true,
        }))
        setCreatedPatterns(tempPatterns)
        setIsDrawerOpen(true)
      } else {
        alert(`Failed to create patterns: ${clusterResult.error}`)
      }
    } catch (error) {
      console.error('Error creating patterns:', error)
      alert('An error occurred while creating patterns')
    } finally {
      setIsCreatingPatterns(false)
    }
  }

  const handleSavePattern = async (pattern: Pattern) => {
    const patternId = pattern.id || pattern.tempId
    if (!patternId) return
    
    setSavingPatternIds(prev => new Set(prev).add(patternId))
    
    try {
      const response = await fetch('/api/patterns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pattern.title,
          description: pattern.description,
          filters: pattern.filters,
          priority: pattern.priority,
          frequency: pattern.frequency,
          time_range_start: pattern.time_range?.start,
          time_range_end: pattern.time_range?.end,
          incident_ids: pattern.incident_ids,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Update the pattern to mark it as saved
        setCreatedPatterns(prev =>
          prev.map(p =>
            (p.id || p.tempId) === patternId
              ? { ...p, id: result.pattern.id, isTemporary: false }
              : p
          )
        )
        alert('Pattern saved successfully!')
      } else {
        alert(`Failed to save pattern: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving pattern:', error)
      alert('An error occurred while saving the pattern')
    } finally {
      setSavingPatternIds(prev => {
        const next = new Set(prev)
        next.delete(patternId)
        return next
      })
    }
  }

  const handleCreateSolution = (pattern: Pattern) => {
    // TODO: Implement solution creation
    console.log('Create solution for pattern:', pattern)
    alert('Solution creation feature coming soon!')
  }

  return (
    <>
      <div className="p-6 space-y-4 h-full flex flex-col bg-gradient-to-br from-slate-50/50 via-white to-slate-100/30 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <RecordsFilters onFiltersChange={setFilters} />
          <Button 
            onClick={handleExplorePatterns}
            disabled={isCreatingPatterns}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
          >
            {isCreatingPatterns ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Patterns...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Explore Patterns
              </>
            )}
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <RecordsTable filters={filters} />
        </div>
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">Discovered Patterns</SheetTitle>
            <SheetDescription>
              Review and save the patterns identified from your filtered records
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {createdPatterns.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No patterns created yet
              </div>
            ) : (
              <div className="space-y-4">
                {createdPatterns.map((pattern) => {
                  const patternId = pattern.id || pattern.tempId
                  const isSaving = savingPatternIds.has(patternId || '')
                  const isSaved = !pattern.isTemporary

                  return (
                    <div
                      key={patternId}
                      className="border rounded-lg p-4 space-y-3 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{pattern.title}</h3>
                            {isSaved && (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Saved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-3">
                            {pattern.description}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium text-slate-700">Priority:</span>{" "}
                              <Badge variant={pattern.priority > 7 ? "destructive" : "default"}>
                                {pattern.priority}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">Frequency:</span>{" "}
                              <span className="text-slate-600">{pattern.frequency}</span>
                            </div>
                            {pattern.time_range && (
                              <>
                                <div className="col-span-2">
                                  <span className="font-medium text-slate-700">Time Range:</span>{" "}
                                  <span className="text-slate-600">
                                    {new Date(pattern.time_range.start).toLocaleDateString()} - {new Date(pattern.time_range.end).toLocaleDateString()}
                                  </span>
                                </div>
                              </>
                            )}
                            <div className="col-span-2">
                              <span className="font-medium text-slate-700">Incidents:</span>{" "}
                              <span className="text-slate-600">{pattern.incident_ids?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          onClick={() => handleSavePattern(pattern)}
                          disabled={isSaving || isSaved}
                          size="sm"
                          variant={isSaved ? "outline" : "default"}
                          className="flex-1"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : isSaved ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Saved
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Pattern
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleCreateSolution(pattern)}
                          size="sm"
                          variant="secondary"
                          className="flex-1"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Create Solution
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
