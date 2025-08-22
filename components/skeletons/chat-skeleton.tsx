import { Skeleton } from "@/components/ui/skeleton"

export function ChatSkeleton() {
  return (
    <div className="flex h-full bg-white">
      {/* Chat List Skeleton - Left Panel */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header Skeleton */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Chat List Skeleton */}
        <div className="flex-1 overflow-y-auto bg-white">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center p-3 border-b border-gray-100">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 ml-3">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area Skeleton - Middle Panel */}
      <div className="flex-1 flex flex-col">
        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(0.5) rotate(0)'%3e%3crect x='0' y='0' width='100%25' height='100%25' fill='%23f0f2f5'/%3e%3cpath d='m0 20v-20h20' fill='none' stroke='%23e5e7eb' stroke-width='1' opacity='0.3'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23a)'/%3e%3c/svg%3e")`,
          backgroundColor: '#f0f2f5'
        }}>
          <div className="text-center">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto mb-1" />
            <Skeleton className="h-3 w-56 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function MessagesSkeleton() {
  return (
    <>
      {/* Chat Header Skeleton */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Messages Skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(0.5) rotate(0)'%3e%3crect x='0' y='0' width='100%25' height='100%25' fill='%23f0f2f5'/%3e%3cpath d='m0 20v-20h20' fill='none' stroke='%23e5e7eb' stroke-width='1' opacity='0.3'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23a)'/%3e%3c/svg%3e")`,
        backgroundColor: '#f0f2f5'
      }}>
        {/* Incoming message skeleton */}
        <div className="flex gap-2">
          <div className="max-w-xs">
            <Skeleton className="h-16 w-64 rounded-lg rounded-bl-sm" />
          </div>
        </div>

        {/* Outgoing message skeleton */}
        <div className="flex gap-2 flex-row-reverse">
          <div className="max-w-xs">
            <Skeleton className="h-12 w-48 rounded-lg rounded-br-sm bg-green-200" />
          </div>
        </div>

        {/* More messages */}
        <div className="flex gap-2">
          <div className="max-w-xs">
            <Skeleton className="h-20 w-56 rounded-lg rounded-bl-sm" />
          </div>
        </div>

        <div className="flex gap-2 flex-row-reverse">
          <div className="max-w-xs">
            <Skeleton className="h-8 w-32 rounded-lg rounded-br-sm bg-green-200" />
          </div>
        </div>
      </div>

      {/* Input Skeleton */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="flex-1 h-10 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      </div>
    </>
  )
}
