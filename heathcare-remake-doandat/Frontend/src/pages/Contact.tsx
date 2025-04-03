import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
}

const chats: Chat[] = [
  { id: 1, name: "Dr. Mai Lịch Kiên", avatar: "https://via.placeholder.com/40", lastMessage: "Bạn: Đau bụng - 1 phút", time: "1 phút" },
  { id: 2, name: "Dr. Minh Anh", avatar: "https://via.placeholder.com/40", lastMessage: "Bạn: hhhh - 25 phút", time: "25 phút" },
  { id: 3, name: "Dr. Peter Đạt", avatar: "https://via.placeholder.com/40", lastMessage: "Bạn: hhhh - 2 giờ", time: "2 giờ" },
  { id: 4, name: "Dr. Nguyễn Mạnh Cường", avatar: "https://via.placeholder.com/40", lastMessage: "Bạn: hhhh - 2 ngày", time: "2 ngày" },
  { id: 5, name: "Dr. Lê Tấn Kiên", avatar: "https://via.placeholder.com/40", lastMessage: "Bạn: :)) - 2 ngày", time: "2 ngày" },
  { id: 6, name: "Dr. Vũ Đức Thịnh", avatar: "https://via.placeholder.com/40", lastMessage: "hhh - 4 ngày", time: "4 ngày" },
  { id: 7, name: "Dr. Vũ Đức Thịnh", avatar: "https://via.placeholder.com/40", lastMessage: "hhh - 4 ngày", time: "4 ngày" },
];

const Contact: React.FC = () => {
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "doctor" }[]>([]);
  const [savedChats, setSavedChats] = useState<Chat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleChatList = () => {
    setIsChatListOpen(!isChatListOpen);
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setIsChatListOpen(false);
    setMessages([]);
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      setMessages([...messages, { text: message, sender: "user" }]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: `${selectedChat.name}: Cảm ơn câu hỏi của bạn, tôi sẽ kiểm tra và trả lời chi tiết!`, sender: "doctor" },
        ]);
      }, 1000);
      setMessage("");
    }
  };

  const saveChat = () => {
    if (selectedChat && !savedChats.some((chat) => chat.id === selectedChat.id)) {
      setSavedChats([...savedChats, selectedChat]);
    }
    setSelectedChat(null);
  };

  const removeSavedChat = (chatId: number) => {
    setSavedChats(savedChats.filter((chat) => chat.id !== chatId));
  };

  const openSavedChat = (chat: Chat) => {
    setSelectedChat(chat);
    setMessages([]);
  };

  const closeChatDetail = () => {
    setSelectedChat(null);
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 pt-20 md:pt-24 flex-grow">
        {/* Tăng padding-top từ py-16 lên pt-20 (80px) hoặc md:pt-24 (96px) */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Liên Hệ Với HealthCare
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Liên hệ qua khung chat, email, hoặc số điện thoại để được giải đáp nhanh chóng!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2l-8 5-8-5h16zm-2 12H6V8l6 4.5L18 8v10z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
            <p className="text-gray-600">support@healthcare.com</p>
            <a href="mailto:support@healthcare.com" className="text-blue-600 hover:underline mt-2 inline-block">
              Gửi email ngay
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.9 15.9 0 006.59 6.59l2.2-2.2a1 1 0 011.41-.13c.92.46 1.91.73 2.98.73a1 1 0 011 1v3.5a1 1 0 01-1 1C10.5 22 2 13.5 2 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.07.27 2.06.73 2.98a1 1 0 01-.13 1.41l-2.2 2.2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Số Điện Thoại</h3>
            <p className="text-gray-600">0123-456-789</p>
            <a href="tel:0123456789" className="text-blue-600 hover:underline mt-2 inline-block">
              Gọi ngay
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Địa Chỉ</h3>
            <p className="text-gray-600">123 Đường Sức Khỏe, TP. HCM</p>
            <a href="#" className="text-blue-600 hover:underline mt-2 inline-block">
              Xem bản đồ
            </a>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gửi Tin Nhắn Cho Chúng Tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Họ và tên"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Số điện thoại"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Chủ đề"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Nội dung tin nhắn"
              className="p-3 border rounded-lg w-full md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
            Gửi Tin Nhắn
          </button>
        </div>
      </div>

      {/* Messenger Button */}
      <div className="fixed top-0 right-0 z-60 mt-[80px] mr-4">
        {!isChatListOpen && !selectedChat && (
          <div
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition"
            onClick={toggleChatList}
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
          </div>
        )}
      </div>

      {/* Chat List Window */}
      {isChatListOpen && !selectedChat && (
        <div className="fixed top-0 right-0 w-96 h-[550px] bg-white rounded-lg shadow-xl mt-20 mr-4 border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
            <h2 className="font-semibold">Đoàn Chat</h2>
            <button className="text-white hover:text-gray-200" onClick={toggleChatList}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Chat List Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm trên Messenger..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex text-blue-600 font-medium mb-2 px-4">
              <span className="mr-4">Hộp thư</span>
              <span>Cộng đồng</span>
            </div>
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="p-4 flex items-center gap-4 hover:bg-gray-100 cursor-pointer transition"
                onClick={() => handleSelectChat(chat)}
              >
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{chat.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Detail Window */}
      {selectedChat && (
        <div className="fixed bottom-0 right-0 w-96 h-[550px] bg-white rounded-lg shadow-xl mb-0 mr-4 border border-gray-200 z-40 flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold">{selectedChat.name}</h3>
                <p className="text-xs text-blue-100">Trực tuyến</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={saveChat} className="text-white hover:text-gray-200">
                --
              </button>
              <button className="text-white hover:text-gray-200" onClick={closeChatDetail}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-gray-500 text-center mt-10">
                Chào bạn! Bắt đầu trò chuyện với {selectedChat.name} nào.
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-3 mb-3 max-w-[80%] shadow-sm ${
                    msg.sender === "user" ? "bg-blue-100 text-blue-800 ml-auto" : "bg-gray-200 text-gray-800 mr-auto"
                  }`}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t bg-white flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
            <button
              type="submit"
              onClick={handleSendMessage}
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Saved Chats */}
      <div className="fixed bottom-0 right-0 z-30 mb-4 mr-4 flex flex-col items-end gap-2">
        {savedChats.map((chat) => (
          <div key={chat.id} className="relative group">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-12 h-12 rounded-full cursor-pointer object-cover shadow-md hover:shadow-lg transition"
              onClick={() => openSavedChat(chat)}
            />
            <button
              onClick={() => removeSavedChat(chat.id)}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Contact;