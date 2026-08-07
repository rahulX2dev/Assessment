export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="h-2.5 w-2.5 rounded-full bg-hub-500 animate-pulseSoft"
              style={{ animationDelay: `${index * 160}ms` }}
            />
          ))}
        </div>
        <p className="text-sm font-medium text-ink-500">Loading module</p>
      </div>
    </div>
  )
}
