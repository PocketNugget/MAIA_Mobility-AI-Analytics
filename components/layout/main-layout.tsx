"use client"

import type { ReactNode } from "react"
import { useState, Suspense } from "react"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"
import { AlertCircle, LayoutGrid, Database, Settings } from "lucide-react"

interface MainLayoutProps {
  children: ReactNode
}

function SidebarFallback({ expanded = false }: { expanded?: boolean }) {
  const navItems = [
    { label: "Dashboard", icon: LayoutGrid },
    { label: "Records", icon: Database },
    { label: "Patterns", icon: Settings },
    { label: "Settings", icon: Settings },
  ]

  return (
    <aside
      className={cn(
        "bg-gradient-to-b from-white via-slate-50/90 to-slate-100/70 border-r-2 border-slate-200/60 flex flex-col transition-all duration-300 ease-in-out h-full shadow-2xl shadow-slate-200/20 backdrop-blur-sm",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="p-4 border-b-2 border-slate-200/60 flex items-center justify-center bg-gradient-to-r from-blue-50/60 to-indigo-50/40 backdrop-blur-sm">
        <div className="flex items-center gap-2 overflow-hidden">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 drop-shadow-sm" />
          <h1
            className={cn(
              "text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent whitespace-nowrap transition-all duration-300",
              expanded ? "opacity-100 w-auto" : "opacity-0 w-0"
            )}
          >
            MAIA
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-2 py-6 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 py-3 rounded-2xl transition-all duration-300 shadow-sm backdrop-blur-sm text-slate-600",
                expanded ? "pl-3 pr-3 justify-start" : "pl-3 pr-3 justify-start"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0 animate-pulse" />
              <span
                className={cn(
                  "text-sm transition-all duration-300 whitespace-nowrap animate-pulse",
                  expanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                )}
              >
                {item.label}
              </span>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/80">
      <div className="relative z-50">
        <Sidebar expanded={false} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
