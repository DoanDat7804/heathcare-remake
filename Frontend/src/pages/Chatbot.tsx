import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
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
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [docList, setDocList] = useState<any[]>([]);

  const token = localStorage.getItem("token") || "";
  const sessionId = useRef(
    token ? JSON.parse(atob(token.split(".")[1])).sub : Math.random().toString(36).substring(7)
  ).current;

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket.io connected");
    });

    socketRef.current.on("newMessage", (data) => {
      const now = new Date().toLocaleTimeString();
    
      // Nếu backend trả về danh sách bác sĩ
      if (Array.isArray(data) && data.length > 0 && data[0].role === "doctor") {
        setDocList(data); // Lưu lại danh sách bác sĩ
    
        const headerMessage: Message = {
          id: Date.now(),
          content: "Đây là chuyên khoa phù hợp và một số bác sĩ phù hợp với mô tả bệnh của bạn.",
          sender: "bot",
          timestamp: now,
        };
    
        const doctorCards = data.map((doctor: any) => {
          const content = `
    🩺 **${doctor.name}**
    🏥 ${doctor.hospital.name}
    📍 ${doctor.hospital.address}
    📞 ${doctor.phone}
    📚 Chuyên khoa: ${doctor.specialty}
    🎓 Kinh nghiệm: ${doctor.experience} năm
    🗣 Ngôn ngữ: ${doctor.languages?.join(", ")}
          `;
    
          return {
            id: Date.now() + Math.random(),
            content,
            sender: "bot",
            timestamp: now,
          } as Message;
        });
    
        setMessages((prev) => [...prev, headerMessage, ...doctorCards]);
      } else {
        const botMessage: Message = {
          id: Date.now(),
          content: data,
          sender: "bot",
          timestamp: now,
        };
    
        setMessages((prev) => [...prev, botMessage]);
      }
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("❌ Socket.io connection error:", error);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🛑 Socket.io disconnected");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendText = () => {
    if (!inputText.trim() || !socketRef.current || !socketRef.current.connected) return;
  
    const userMessage: Message = {
      id: Date.now(),
      content: inputText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
  
    const symptoms = [...new Set(docList.map((doc) => doc.specialty))];
  
    socketRef.current.emit("sendMessage", {
      user_msg: inputText,
      token: token,
      symptoms: ["Tired"],
      docList: docList.length > 0 ? docList : undefined,
    });
  
    setInputText("");
  };
  

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-hospital-500 text-white rounded-full p-4 shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 bg-white rounded-xl shadow-xl flex flex-col h-[70vh]">
          <div className="bg-hospital-500 text-white p-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Chatbot HealthCare</h2>
            <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-white p-1">
              <X className="h-5 w-5" />
            </Button>
          </div>

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
