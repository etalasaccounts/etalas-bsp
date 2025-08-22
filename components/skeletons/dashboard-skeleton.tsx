import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Welcome Header Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-green-600 to-blue-600 rounded-2xl p-8">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full bg-white/20" />
              <div>
                <Skeleton className="h-8 w-80 mb-2 bg-white/20" />
                <Skeleton className="h-5 w-96 bg-white/20" />
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end gap-2">
              <Skeleton className="h-6 w-32 bg-white/20" />
              <Skeleton className="h-4 w-24 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border-0 shadow-lg rounded-lg bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity Skeleton */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Quick Actions Skeleton */}
        <div className="border-0 shadow-lg rounded-lg bg-white">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between h-12 border border-gray-200 rounded p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights Skeleton */}
        <div className="border-0 shadow-lg rounded-lg bg-white">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-6 w-12 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Conversations Preview Skeleton */}
      <div className="border-0 shadow-lg rounded-lg bg-white">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-24 rounded" />
          </div>
        </div>
        <div className="p-12 text-center">
          <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto mb-6" />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    </div>
  )
}
