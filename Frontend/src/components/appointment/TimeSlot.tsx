
import { cn } from "@/lib/utils";

interface TimeSlotProps {
  time: string;
  available?: boolean;
  selected?: boolean;
  onClick: () => void;
}

const TimeSlot = ({ 
  time, 
  available = true,
  selected = false,
  onClick 
}: TimeSlotProps) => {
  return (
    <button
      className={cn(
        "py-2 px-4 rounded-lg text-sm font-medium transition-all",
        available 
          ? selected 
            ? "bg-hospital-500 text-white hover:bg-hospital-600" 
            : "bg-white hover:bg-hospital-50 border border-gray-200" 
          : "bg-gray-100 text-gray-400 cursor-not-allowed",
      )}
      disabled={!available}
      onClick={onClick}
    >
      {time}
    </button>
  );
};

export default TimeSlot;
