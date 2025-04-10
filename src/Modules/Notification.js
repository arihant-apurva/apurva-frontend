import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// toast.configure(); // Initialize the toast library

const Notification = {
  success: (message) => {
    toast.success(message);
  },
  error: (message) => {
    toast.error(message);
  },
  info: (message) => {
    toast.info(message);
  },
  warning: (message) => {
    toast.warn(message);
  },
};

export default Notification;
