import { cn } from "@/lib/utils";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400"] });

type SectionHeadingProps = {
  title: string;
  className?: string;
};

export default function SectionHeading({
  title,
  className,
}: SectionHeadingProps) {
  return (
    <h2 className={cn(montserrat.className, "text-lg mb-3", className)}>
      {title}
    </h2>
  );
}
