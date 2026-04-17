import type { LucideIcon } from 'lucide-react'

interface Action {
  label: string
  onClick: () => void
  primary?: boolean
}

interface Props {
  icon: LucideIcon
  title: string
  description: string
  actions: Action[]
}

export function EmptyState({ icon: Icon, title, description, actions }: Props) {
  return (
    <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-2xl p-10 text-center">
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mx-auto mb-4">
        <Icon className="w-5 h-5 text-slate-300" />
      </div>
      <p className="text-sm font-semibold mb-1 text-slate-900">{title}</p>
      <p className="text-xs mb-5 text-slate-400 max-w-xs mx-auto">{description}</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            className={
              action.primary
                ? 'text-xs font-bold uppercase tracking-widest text-white bg-slate-900 px-6 py-2.5 rounded-xl hover:bg-slate-700 transition-all'
                : 'text-xs font-bold uppercase tracking-widest text-slate-900 border border-slate-200 bg-white px-6 py-2.5 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all'
            }
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
