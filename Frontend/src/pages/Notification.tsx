import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

interface NotificationItem {
  patientID: string;
  appointmentDate: string;
  message: string;
  method: 'EMAIL' | 'SMS' | 'CHATBOT';
  status: 'PENDING' | 'SENT';
}

const sendNotification = async (method: string, patientID: string, message: string): Promise<void> => {
  switch (method) {
    case 'EMAIL':
      console.log(`Sending email to ${patientID}: ${message}`);
      break;
    case 'SMS':
      console.log(`Sending SMS to ${patientID}: ${message}`);
      break;
    case 'CHATBOT':
      console.log(`Chatbot notifying ${patientID}: ${message}`);
      break;
    default:
      console.log('Invalid method');
  }
};

const sampleNotifications: NotificationItem[] = [
  {
    patientID: 'P001',
    appointmentDate: '2025-03-06T10:00:00',
    message: 'Bạn có lịch khám lúc 10:00 ngày 06/03/2025',
    method: 'EMAIL',
    status: 'PENDING',
  },
  {
    patientID: 'P002',
    appointmentDate: '2025-03-07T14:00:00',
    message: 'Bạn có lịch khám lúc 14:00 ngày 07/03/2025',
    method: 'SMS',
    status: 'PENDING',
  },
];

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(sampleNotifications); // Khởi tạo state chỉ một lần
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const updatedNotifications = notifications.map((notification) => {
        const appointmentTime = new Date(notification.appointmentDate);
        const timeDiff = (appointmentTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

        if (timeDiff <= 24 && notification.status === 'PENDING') {
          sendNotification(notification.method, notification.patientID, notification.message);
          return { ...notification, status: 'SENT' as const }; // Trả về bản sao mới với status thay đổi
        }
        return notification;
      });

      // Chỉ cập nhật state nếu có thay đổi thực sự
      if (JSON.stringify(updatedNotifications) !== JSON.stringify(notifications)) {
        setNotifications(updatedNotifications);
      }
    }, 3600000); // Kiểm tra mỗi giờ

    return () => clearInterval(interval);
  }, []); // Dependency array rỗng để chỉ chạy khi mount

  const toggleNotifications = (): void => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleNotifications}
        className="relative p-2 text-gray-700 hover:text-hospital-600 focus:outline-none"
      >
        <Bell size={24} />
        {notifications.some((n) => n.status === 'PENDING') && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {notifications.filter((n) => n.status === 'PENDING').length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-10 right-0 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          <h3 className="text-lg font-semibold mb-2">Thông báo</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500">Không có thông báo nào</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification, index) => (
                <li
                  key={index}
                  className={`p-2 rounded ${
                    notification.status === 'PENDING' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}
                >
                  <p className="font-medium">Bệnh nhân: {notification.patientID}</p>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-600">Phương thức: {notification.method}</p>
                  <p className="text-xs text-gray-600">Trạng thái: {notification.status}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;