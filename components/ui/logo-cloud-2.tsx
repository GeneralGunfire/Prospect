import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div">;

const institutions = [
  { src: "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/UCT_logo.svg/200px-UCT_logo.svg.png", alt: "University of Cape Town" },
  { src: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Wits_logo.svg/200px-Wits_logo.svg.png", alt: "University of the Witwatersrand" },
  { src: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ed/University_of_South_Africa_logo.svg/200px-University_of_South_Africa_logo.svg.png", alt: "UNISA" },
  { src: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Stellenbosch_University_logo.svg/200px-Stellenbosch_University_logo.svg.png", alt: "Stellenbosch University" },
  { src: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/University_of_Pretoria_logo.svg/200px-University_of_Pretoria_logo.svg.png", alt: "University of Pretoria" },
  { src: "https://upload.wikimedia.org/wikipedia/en/thumb/f/fb/DUT_logo.svg/200px-DUT_logo.svg.png", alt: "Durban University of Technology" },
  { src: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/University_of_Johannesburg_logo.svg/200px-University_of_Johannesburg_logo.svg.png", alt: "University of Johannesburg" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/TVET_Colleges_South_Africa.svg/200px-TVET_Colleges_South_Africa.svg.png", alt: "TVET Colleges SA" },
];

export function LogoCloud({ className, ...props }: LogoCloudProps) {
  return (
    <div
      className={cn("relative grid grid-cols-2 border-x md:grid-cols-4", className)}
      {...props}
      data-logo-cloud
    >
      <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t" />

      {institutions.map((inst, i) => {
        const isLast = i === institutions.length - 1;
        const hasRightPlus = i % 2 === 0 && i < institutions.length - 1;
        return (
          <LogoCard
            key={inst.alt}
            className={cn(
              "relative",
              i % 2 === 0 && "border-r",
              i < institutions.length - 2 && "border-b",
              i % 4 === 1 && "md:border-r",
              i % 4 === 2 && "md:border-r",
              i < 4 && "md:border-b",
            )}
            logo={inst}
          >
            {hasRightPlus && (
              <PlusIcon
                className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6 text-slate-300"
                strokeWidth={1}
              />
            )}
          </LogoCard>
        );
      })}

      <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b" />
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
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-[#176293]/10 flex items-center justify-center">
          <span className="text-[#176293] font-bold text-sm">
            {logo.alt.split(" ").map(w => w[0]).slice(0, 2).join("")}
          </span>
        </div>
        <span className="text-xs font-medium text-slate-600 text-center max-w-[100px] leading-tight">
          {logo.alt}
        </span>
      </div>
      {children}
    </div>
  );
}
