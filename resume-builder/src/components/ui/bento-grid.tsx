import { type ComponentPropsWithoutRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className?: string
  background?: ReactNode
  Icon?: React.ElementType
  description: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl",
      "bg-[#F2F2F2] border border-[#ACACAC]",
      className
    )}
    {...props}
  >
    {background && <div className="absolute inset-0">{background}</div>}
    <div className="relative z-10 flex h-full flex-col justify-end p-6">
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300">
        {Icon && (
          <Icon className="h-10 w-10 origin-left transform-gpu text-slate-700 transition-all duration-300 ease-in-out" />
        )}
        <h3 className="text-lg font-semibold text-slate-900">
          {name}
        </h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[0.03]" />
  </div>
)

export { BentoCard, BentoGrid }
