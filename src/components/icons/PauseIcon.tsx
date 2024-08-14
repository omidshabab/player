import { cn } from "@/lib/utils";

const PauseIcon = ({
  width = 69,
  height = 69,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 69 85"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-auto text-white/25", className)}
  >
    <rect width={25.45} height={84.99} rx={6} />
    <rect x={43} width={25.45} height={84.99} rx={6} />
  </svg>
);
export default PauseIcon;
