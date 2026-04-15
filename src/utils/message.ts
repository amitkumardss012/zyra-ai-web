import { AxiosError } from "axios";
import { toast } from "sonner";

export const showError = (error: AxiosError | Error) => {
    if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
    } else {
        toast.error(error.message)
    }
}