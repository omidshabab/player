import { cn } from "@/lib/utils";

const PauseIcon = ({
  className,
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 69 85"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-auto text-white/25 w-[64px] h-[64px]", className)}
  >
    <rect width={25.45} height={84.99} rx={6} />
    <rect x={43} width={25.45} height={84.99} rx={6} />
  </svg>
);
export default PauseIcon;
