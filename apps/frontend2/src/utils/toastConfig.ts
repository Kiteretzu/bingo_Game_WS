// src/utils/toastConfig.ts

import { ToastOptions } from "react-toastify";

export const defaultToastConfig: ToastOptions = {
  position: "top-center",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  closeButton: false,
  draggable: true,
  theme: "dark",
  style: {
    backgroundColor: "#1f2937",
    color: "#f3f4f6",
    border: "1px solid #374151",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
  },
};
