import { MainLayout } from "@/components/layout/main-layout"
import { RecordDetailPage } from "@/components/pages/record-detail-page"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default async function RecordDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="p-8 h-full flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <p className="text-slate-600">Loading record details...</p>
          </div>
        </div>
      }>
        <RecordDetailPage recordId={id} />
      </Suspense>
    </MainLayout>
  )
}
