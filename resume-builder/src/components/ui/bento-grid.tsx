"use client";

import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import { motion } from "motion/react"

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
  shortDescription?: string
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
  shortDescription,
  ...props
}: BentoCardProps) => (
  <motion.div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl",
      "bg-[#F2F2F2] border border-[#ACACAC]",
      className
    )}
    initial="rest"
    whileHover="hover"
    animate="rest"
    {...props}
  >
    {background && <div className="absolute inset-0">{background}</div>}
    {background && (
      <motion.div 
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent z-[5]"
        variants={{
          rest: { height: "50%" },
          hover: { height: "100%" }
        }}
        transition={{ duration: 0.3, ease: "easeIn" }}
      />
    )}
    <motion.div 
      className="relative z-10 flex h-full flex-col justify-end p-6"
      variants={{
        rest: { y: background ? 20 : 0 },
        hover: { y: -20 }
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300">
        {Icon && (
          <Icon className="h-10 w-10 origin-left transform-gpu text-slate-700 transition-all duration-300 ease-in-out" />
        )}
        <h3 className="text-lg font-semibold text-slate-900">
          {name}
        </h3>
        {shortDescription ? (
          <div className="relative min-h-[3rem]">
            <motion.p 
              className="text-sm text-slate-600"
              variants={{
                rest: { opacity: 1 },
                hover: { opacity: 0 }
              }}
              transition={{ duration: 0.2 }}
            >
              {shortDescription}
            </motion.p>
            <motion.p 
              className="text-sm text-slate-600 absolute top-0 left-0 right-0"
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1 }
              }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {description}
            </motion.p>
          </div>
        ) : (
          <p className="text-sm text-slate-600">{description}</p>
        )}
      </div>
    </motion.div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[0.03]" />
  </motion.div>
)

export { BentoCard, BentoGrid }
