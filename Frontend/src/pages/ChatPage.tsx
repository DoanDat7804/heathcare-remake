import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import Layout from "@/components/Layout";
import axios from "axios";

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Xin chào! Tôi là trợ lý y tế ảo của bạn. Tôi có thể giúp gì cho bạn hôm nay?",
    isUser: false,
    timestamp: new Date(),
  },
];

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !token) {
      if (!token) {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, text: "Vui lòng đăng nhập để tiếp tục.", isUser: false, timestamp: new Date() },
        ]);
      }
      return;
    }

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    try {
      // Gửi trực tiếp tới backend (nếu không dùng Dialogflow API)
      const response = await axios.post(
        " https://38fc-118-70-133-195.ngrok-free.app/dialogflow-webhook",
        {
          queryResult: { queryText: newMessage },
          session: `session-${Date.now()}`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botResponse: Message = {
        id: messages.length + 2,
        text: response.data.fulfillmentText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Quay lại trang chủ
        </Button>

        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <MessageSquare className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold">Trợ Lý Y Tế</h1>
        </div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <p className="text-gray-600">
              Trợ lý ảo của chúng tôi có thể trả lời các câu hỏi chung về dịch vụ, giúp bạn hiểu triệu chứng, và hướng dẫn đặt lịch với bác sĩ.
            </p>
          </CardContent>
        </Card>

        <div ref={chatContainerRef} className="border rounded-lg bg-white mb-4 h-[400px] overflow-y-auto">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isUser ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-2">
          <Button variant="outline" onClick={() => setNewMessage("Tôi bị ho")}>
            Báo triệu chứng
          </Button>
          <Button variant="outline" onClick={() => setNewMessage("Tôi muốn gặp bác sĩ Lan")}>
            Đặt lịch bác sĩ
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Nhập tin nhắn của bạn tại đây..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4" />
            <span className="ml-2">Gửi</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;