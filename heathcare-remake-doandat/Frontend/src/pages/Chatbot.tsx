import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, MessageCircle } from "lucide-react";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
}

const ChatDetail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Chào bạn! Tôi là Chatbot của HealthCare. Hôm nay tôi có thể giúp gì cho bạn?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cuộn xuống tin nhắn mới nhất khi mở chat hoặc có tin nhắn mới
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Xử lý gửi tin nhắn (chỉ thêm tin nhắn user, không gọi API)
  const handleSendText = () => {
    if (!inputText.trim()) return; // Ngăn gửi tin nhắn rỗng

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
  };

  return (
    <>
      {/* Nút mở chat */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-hospital-500 text-white rounded-full p-4 shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Giao diện chat khi mở */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 bg-white rounded-xl shadow-xl flex flex-col h-[70vh]">
          {/* Header */}
          <div className="bg-hospital-500 text-white p-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Chatbot HealthCare</h2>
            <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-white p-1">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Khu vực hiển thị tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === "user" ? "bg-hospital-500 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p>{message.content}</p>
                  <span className="text-xs opacity-70 block mt-1">{message.timestamp}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
</div>

          {/* Khu vực nhập tin nhắn */}
          <div className="p-3 border-t flex items-center gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSendText()}
            />
            <Button onClick={handleSendText} className="bg-hospital-500 p-2">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatDetail;