import { Request, Response } from 'express';
import Notification from '../notifications/notification.model'; // Giả sử bạn đã định nghĩa model này

// Lấy danh sách tất cả thông báo
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find(); // Lấy tất cả thông báo từ database
    res.status(200).json(notifications); // Trả về danh sách thông báo
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách thông báo', error });
  }
};

// Tạo một thông báo mới
export const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, type, recipient } = req.body; // Lấy dữ liệu từ body của request
    const newNotification = new Notification({ message, type, recipient }); // Tạo thông báo mới
    await newNotification.save(); // Lưu vào database
    res.status(201).json(newNotification); // Trả về thông báo vừa tạo
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo thông báo', error });
  }
};

// Cập nhật thông báo
export const updateNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Lấy ID từ URL
    const updatedData = req.body; // Lấy dữ liệu cần cập nhật từ body
    const updatedNotification = await Notification.findByIdAndUpdate(id, updatedData, { new: true }); // Cập nhật và trả về bản ghi mới
    if (!updatedNotification) {
      res.status(404).json({ message: 'Thông báo không tồn tại' });
      return;
    }
    res.status(200).json(updatedNotification); // Trả về thông báo đã cập nhật
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thông báo', error });
  }
};

// Xóa thông báo
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Lấy ID từ URL
    const deletedNotification = await Notification.findByIdAndDelete(id); // Xóa thông báo
    if (!deletedNotification) {
      res.status(404).json({ message: 'Thông báo không tồn tại' });
      return;
    }
    res.status(200).json({ message: 'Thông báo đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa thông báo', error });
  }
};