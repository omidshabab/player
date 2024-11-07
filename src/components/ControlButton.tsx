import { cn } from "@/lib/utils";

const ControlButton = ({
  onClick,
  className,
  children,
  animate = true,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  animate?: boolean
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white/5 backdrop-blur-md rounded-full p-[10px] flex justify-center items-center transition-all duration-500 cursor-pointer",
        animate && "hover:scale-110",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ControlButton;
