import { Slide, toast } from "react-toastify";

export function SuccessToast(message: string) {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
  });
}
export function ErrorToast(message: string) {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
  });
}
