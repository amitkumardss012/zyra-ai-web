import { AxiosError } from "axios";
import { toast } from "sonner";

export const showSuccess = (message: string) => {
    toast.success(message, { duration: 5000 })
}

export const showError = (error: unknown) => {
    if (error instanceof AxiosError) {
        const serverMessage = error.response?.data?.message;
        toast.error(serverMessage || error.message || "An unexpected server error occurred", { duration: 5000 });
    } else if (error instanceof Error) {
        toast.error(error.message || "Something went wrong", { duration: 5000 });
    } else {
        toast.error("An unknown error occurred", { duration: 5000 });
    }
}
