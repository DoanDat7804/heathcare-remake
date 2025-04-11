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

  // Giả định token được lưu trong localStorage sau khi đăng nhập
  const token = localStorage.getItem("access_token") || "";
  
  // Tạo session ID (có thể lấy từ user ID trong token hoặc tạo ngẫu nhiên)
  const sessionId = useRef(
    token ? JSON.parse(atob(token.split(".")[1])).sub : Math.random().toString(36).substring(7)
  ).current;

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Gửi tin nhắn đến backend webhook
  const handleSendText = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    try {
      const response = await fetch("https://cf9c-2405-4803-fc1b-29c0-981c-7b79-87bd-227b.ngrok-free.app/dialogflow-webhook", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Gửi token JWT
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queryInput: {
            text: {
              text: inputText,
              languageCode: "vi",
            },
          },
          sessionId: sessionId, // Gửi session ID để duy trì ngữ cảnh
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Vui lòng đăng nhập lại để tiếp tục.");
        }
        throw new Error("Có lỗi từ server. Vui lòng thử lại.");
      }

      const data = await response.json();
      const botResponseText = data.fulfillmentText;

      const botMessage: Message = {
        id: messages.length + 2,
        content: botResponseText,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling webhook:", error);
      const errorMessage: Message = {
        id: messages.length + 2,
        content: error.message || "Có lỗi xảy ra khi liên lạc với chatbot. Vui lòng thử lại.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
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