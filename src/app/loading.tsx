export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin-slow" role="status" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
