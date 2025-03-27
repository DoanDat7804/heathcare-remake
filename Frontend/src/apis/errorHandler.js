// errorHandler.js
import { toast } from 'react-toastify';

export const handleError = (error, defaultMsg) => {
  const message = error?.response?.data?.message || error?.message || defaultMsg;
  toast.error(message);
  throw error;
};