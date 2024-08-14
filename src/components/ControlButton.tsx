import { cn } from "@/lib/utils";

const ControlButton = ({
  onClick,
  className,
  children,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white/5 backdrop-blur-md rounded-full p-[10px] flex justify-center items-center hover:scale-110 transition-all duration-500 cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ControlButton;
