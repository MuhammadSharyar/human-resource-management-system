import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type SectionContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionContainer({
  children,
  className,
}: SectionContainerProps) {
  return (
    <div className={cn("px-5 pt-3 md:ml-[20%]", className)}>{children}</div>
  );
}
