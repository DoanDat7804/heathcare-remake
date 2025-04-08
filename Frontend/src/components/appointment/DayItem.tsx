import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth"; // Thêm useAuth để kiểm tra đăng nhập

interface DayItemProps {
  day: string;
  date: string;
  available?: boolean;
  selected?: boolean;
  onClick: () => void;
}

const DayItem = ({ 
  day, 
  date, 
  available = true,
  selected = false,
  onClick 
}: DayItemProps) => {
  const { isAuthenticated } = useAuth(); // Kiểm tra trạng thái đăng nhập

  const handleClick = () => {
    if (!isAuthenticated) {
      return; // Không cho chọn nếu chưa đăng nhập
    }
    onClick();
  };

  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center w-12 h-16 rounded-lg transition-all",
        available && isAuthenticated
          ? selected
            ? "bg-hospital-500 text-white"
            : "bg-white hover:bg-hospital-50 border border-gray-200"
          : "bg-gray-100 text-gray-400 cursor-not-allowed",
      )}
      disabled={!available || !isAuthenticated}
      onClick={handleClick}
    >
      <span className="text-xs font-medium">{day}</span>
      <span className={cn("text-lg font-semibold", selected ? "text-white" : "")}>{date}</span>
    </button>
  );
};

export default DayItem;