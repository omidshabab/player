import { cn } from "@/lib/utils";

const PlayIcon = ({
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
    fill="currentColor"
    className={cn("text-auto text-white/25", className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 80 87"
  >
    <path d="M56.25 21.4629C68.0639 28.2836 73.9708 31.694 75.9532 36.1464C77.6823 40.03 77.6823 44.4649 75.9532 48.3485C73.9708 52.8009 68.0639 56.2113 56.25 63.0321L36 74.7234C24.1861 81.5442 18.2792 84.9545 13.4321 84.4451C9.2042 84.0007 5.36349 81.7833 2.86474 78.344C-1.19209e-06 74.401 0 67.5803 0 53.9388L9.53674e-07 30.556C1.95367e-06 16.9146 1.66893e-06 10.0938 2.86474 6.15085C5.3635 2.71161 9.2042 0.49416 13.4321 0.0497998C18.2792 -0.459651 24.1861 2.95073 36 9.77149L56.25 21.4629Z" />
  </svg>
);

export default PlayIcon;