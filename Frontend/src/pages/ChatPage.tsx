
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import Layout from "@/components/Layout";

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

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate bot response after a short delay
    setTimeout(() => {
      let botResponse = "";
      const lowercaseMessage = newMessage.toLowerCase();

      if (lowercaseMessage.includes("lịch hẹn") || lowercaseMessage.includes("đặt khám") || lowercaseMessage.includes("khám bệnh")) {
        botResponse = "Bạn có thể đặt lịch hẹn với bác sĩ của chúng tôi ở trang đặt lịch. Bạn có muốn tôi hướng dẫn bạn đến đó không?";
      } else if (lowercaseMessage.includes("triệu chứng") || lowercaseMessage.includes("đau") || lowercaseMessage.includes("bệnh")) {
        botResponse = "Tôi hiểu rằng bạn không cảm thấy khỏe. Bạn có thể mô tả chi tiết hơn về các triệu chứng của mình không? Tuy nhiên, đừng quên rằng tôi không thể thay thế cho ý kiến của bác sĩ.";
      } else if (lowercaseMessage.includes("cảm ơn")) {
        botResponse = "Không có gì! Rất vui được giúp đỡ bạn!";
      } else if (lowercaseMessage.includes("xin chào") || lowercaseMessage.includes("chào")) {
        botResponse = "Xin chào! Tôi có thể giúp gì cho sức khỏe của bạn hôm nay?";
      } else {
        botResponse = "Cảm ơn tin nhắn của bạn. Để nhận câu trả lời chính xác hơn, đừng ngại tham khảo ý kiến của bác sĩ chúng tôi. Bạn có muốn đặt lịch hẹn không?";
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="mb-4 flex items-center gap-1"
        >
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
              Trợ lý ảo của chúng tôi có thể trả lời các câu hỏi chung về dịch vụ của chúng tôi, 
              giúp bạn hiểu một số triệu chứng phổ biến, và hướng dẫn bạn đến các nguồn thông tin thích hợp. 
              Đối với các câu hỏi y tế cụ thể, vui lòng tham khảo ý kiến bác sĩ.
            </p>
          </CardContent>
        </Card>
        
        <div className="border rounded-lg bg-white mb-4 h-[400px] overflow-y-auto">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
