import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div">;

export function LogoCloud({ className, ...props }: LogoCloudProps) {
  return (
    <div className={cn("py-10 bg-white border-y border-slate-100", className)} {...props}>
      <p className="text-center text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-8">
        Built with industry-leading tools
      </p>
      <div
        className="relative grid grid-cols-2 border-x border-slate-200 md:grid-cols-4 max-w-5xl mx-auto"
      >
        <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t border-slate-200" />

        <LogoCard
          className="relative border-r border-b border-slate-200"
          logo={{ src: "https://svgl.app/library/nvidia-wordmark-light.svg", alt: "Nvidia" }}
        >
          <PlusIcon className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6 text-slate-300" strokeWidth={1} />
        </LogoCard>

        <LogoCard
          className="border-b border-slate-200 md:border-r md:border-slate-200"
          logo={{ src: "https://svgl.app/library/supabase_wordmark_light.svg", alt: "Supabase" }}
        />

        <LogoCard
          className="relative border-r border-b border-slate-200 bg-slate-50"
          logo={{ src: "https://svgl.app/library/github_wordmark_light.svg", alt: "GitHub" }}
        >
          <PlusIcon className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6 text-slate-300" strokeWidth={1} />
          <PlusIcon className="-bottom-[12.5px] -left-[12.5px] absolute z-10 hidden size-6 text-slate-300 md:block" strokeWidth={1} />
        </LogoCard>

        <LogoCard
          className="border-b border-slate-200 bg-slate-50 md:bg-white"
          logo={{ src: "https://svgl.app/library/openai_wordmark_light.svg", alt: "OpenAI" }}
        />

        <LogoCard
          className="relative border-r border-b border-slate-200 md:border-b-0"
          logo={{ src: "https://svgl.app/library/turso-wordmark-light.svg", alt: "Turso" }}
        >
          <PlusIcon className="-right-[12.5px] -bottom-[12.5px] md:-left-[12.5px] absolute z-10 size-6 text-slate-300 md:hidden" strokeWidth={1} />
        </LogoCard>

        <LogoCard
          className="border-b border-slate-200 md:border-r md:border-b-0 md:bg-slate-50"
          logo={{ src: "https://svgl.app/library/clerk-wordmark-light.svg", alt: "Clerk" }}
        />

        <LogoCard
          className="border-r border-slate-200"
          logo={{ src: "https://svgl.app/library/claude-ai-wordmark-icon_light.svg", alt: "Claude AI" }}
        />

        <LogoCard
          className="bg-slate-50"
          logo={{ src: "https://svgl.app/library/vercel_wordmark.svg", alt: "Vercel" }}
        />

        <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b border-slate-200" />
      </div>
    </div>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
  return (
    <div
      className={cn("flex items-center justify-center bg-white px-4 py-8 md:p-8", className)}
      {...props}
    >
      <img
        alt={logo.alt}
        className="pointer-events-none h-4 select-none md:h-5"
        height={logo.height || "auto"}
        src={logo.src}
        width={logo.width || "auto"}
        style={{ filter: "brightness(0) saturate(100%) invert(20%) sepia(10%) saturate(500%) hue-rotate(180deg) brightness(90%)" }}
      />
      {children}
    </div>
  );
}
