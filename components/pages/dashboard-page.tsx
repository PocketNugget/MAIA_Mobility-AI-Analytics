"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { MetricCard } from "@/components/dashboard/metric-card"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { PatternsTable } from "@/components/dashboard/patterns-table"
import { LineChartComponent } from "@/components/dashboard/charts/line-chart"
import { BarChartComponent } from "@/components/dashboard/charts/bar-chart"
import { PieChartComponent } from "@/components/dashboard/charts/pie-chart"
import { AreaChartComponent } from "@/components/dashboard/charts/area-chart"
import { RadarChartComponent } from "@/components/dashboard/charts/radar-chart"
import { DraggableItem } from "@/components/dashboard/draggable-item"
import { TrendingUp, AlertTriangle, Activity, Zap, Edit3, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DisplayPattern } from "@/lib/types"

export function DashboardPage() {
  const [isEditMode, setIsEditMode] = useState(false)

  const externalPatterns: DisplayPattern[] = [
    {
      id: "1",
      text: "#mobility",
      count: 342,
      recordIds: [],
      firstSeen: "2025-01-15",
      lastSeen: "2025-11-22",
      type: "external" as const,
    },
    {
      id: "2",
      text: "autonomous vehicles",
      count: 287,
      recordIds: [],
      firstSeen: "2025-01-15",
      lastSeen: "2025-11-22",
      type: "external" as const,
    },
    {
      id: "3",
      text: "EV charging",
      count: 156,
      recordIds: [],
      firstSeen: "2025-01-15",
      lastSeen: "2025-11-22",
      type: "external" as const,
    },
    {
      id: "4",
      text: "smart cities",
      count: 128,
      recordIds: [],
      firstSeen: "2025-01-15",
      lastSeen: "2025-11-22",
      type: "external" as const,
    },
  ]

  const [sections, setSections] = useState([
    { id: "metrics", component: "metrics" },
    { id: "line-chart-alerts", component: "line-chart-alerts" },
    { id: "bar-pie-charts", component: "bar-pie-charts" },
    { id: "area-radar-charts", component: "area-radar-charts" },
    { id: "patterns", component: "patterns" },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const renderSection = (section: { id: string; component: string }) => {
    switch (section.component) {
      case "metrics":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Active Records" value="2,847" icon={Activity} trend="+12.5%" trendPositive />
            <MetricCard title="Processing Rate" value="94.2%" icon={TrendingUp} trend="+2.1%" trendPositive />
            <MetricCard title="Alerts Today" value="23" icon={AlertTriangle} trend="+5" trendPositive={false} />
            <MetricCard title="API Calls" value="45.2K" icon={Zap} trend="+8.3%" trendPositive />
          </div>
        )
      case "line-chart-alerts":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LineChartComponent />
            </div>
            <AlertsPanel />
          </div>
        )
      case "bar-pie-charts":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartComponent />
            <PieChartComponent />
          </div>
        )
      case "area-radar-charts":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AreaChartComponent />
            <RadarChartComponent />
          </div>
        )
      case "patterns":
        return (
          <div>
            <PatternsTable title="Top External Patterns (Twitter)" patterns={externalPatterns} type="external" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Real-time mobility insights and alerts</p>
        </div>
        <Button
          onClick={() => setIsEditMode(!isEditMode)}
          variant={isEditMode ? "default" : "outline"}
          size="default"
          className={`flex items-center gap-2 transition-all ${
            isEditMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {isEditMode ? (
            <>
              <Eye className="w-4 h-4" />
              View Only
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              Edit Layout
            </>
          )}
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className={`space-y-8 ${isEditMode ? 'pl-8' : ''}`}>
            {sections.map((section) => (
              <DraggableItem key={section.id} id={section.id} isEditMode={isEditMode}>
                {renderSection(section)}
              </DraggableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
