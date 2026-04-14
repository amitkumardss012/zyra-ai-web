import type {Session} from "next-auth"
import { auth } from "../../auth"

export const useAuth = async () => {
    const session: Session | null = await auth()
    return session
}