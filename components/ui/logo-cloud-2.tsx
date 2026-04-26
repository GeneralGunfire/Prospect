import { cn } from "@/lib/utils";

type Tool = {
  name: string;
  abbr: string;
  color: string;
  bg: string;
};

type LogoCloudProps = React.ComponentProps<"div">;

const tools: Tool[] = [
  { name: "Claude Code", abbr: "CC", color: "text-[#D97706]", bg: "bg-amber-50" },
  { name: "Google Gemini", abbr: "G", color: "text-[#4285F4]", bg: "bg-blue-50" },
  { name: "Google AI Studio", abbr: "AI", color: "text-[#34A853]", bg: "bg-green-50" },
  { name: "Supabase", abbr: "SB", color: "text-[#3ECF8E]", bg: "bg-emerald-50" },
  { name: "Vite", abbr: "V", color: "text-[#646CFF]", bg: "bg-indigo-50" },
  { name: "React", abbr: "R", color: "text-[#61DAFB]", bg: "bg-cyan-50" },
  { name: "Tailwind CSS", abbr: "TW", color: "text-[#06B6D4]", bg: "bg-sky-50" },
  { name: "TypeScript", abbr: "TS", color: "text-[#3178C6]", bg: "bg-blue-50" },
];

export function LogoCloud({ className, ...props }: LogoCloudProps) {
  return (
    <div className={cn("bg-white py-12 border-y border-slate-100", className)} {...props} data-logo-cloud>
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mb-8">
          Built with industry-leading tools
        </p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {tools.map((tool) => (
            <div key={tool.name} className="flex flex-col items-center gap-2">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100", tool.bg)}>
                <span className={cn("text-sm font-black", tool.color)}>{tool.abbr}</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 text-center leading-tight hidden sm:block">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
