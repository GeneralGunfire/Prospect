interface StepIndicatorProps { current: number; total: number; label?: string }

export function StepIndicator({ current, total, label = 'Step' }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">{label} {current} of {total}</p>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`w-8 h-1 rounded-full transition-all ${i < current ? 'bg-blue-600' : 'bg-slate-200'}`} />
        ))}
      </div>
    </div>
  )
}
