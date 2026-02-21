import { toast as reactToast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
};

export const toast = {
    success: (message: string, options?: ToastOptions) => {
        return reactToast.success(message, { toastId: message, ...defaultOptions, ...options, className: 'bg-green-600 font-bold text-white' });
    },
    error: (message: string, options?: ToastOptions) => {
        return reactToast.error(message, { toastId: message, ...defaultOptions, ...options, className: 'bg-red-600 font-bold text-white' });
    },
    warning: (message: string, options?: ToastOptions) => {
        return reactToast.warning(message, { toastId: message, ...defaultOptions, ...options, className: 'bg-yellow-500 font-bold text-white' });
    },
    info: (message: string, options?: ToastOptions) => {
        return reactToast.info(message, { toastId: message, ...defaultOptions, ...options, className: 'bg-blue-600 font-bold text-white' });
    },
    default: (message: string, options?: ToastOptions) => {
        return reactToast(message, { toastId: message, ...defaultOptions, ...options });
    }
};
