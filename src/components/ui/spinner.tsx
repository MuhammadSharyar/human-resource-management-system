import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
};

export default function Spinner({ size = "sm" }: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
        size === "sm"
          ? "h-5 w-5 border-2"
          : size === "md"
          ? "h-6 w-6 border-2"
          : "h-7 w-7 border-4"
      )}
      role="status"
    ></div>
  );
}
