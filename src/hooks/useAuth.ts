import { auth } from "../../auth"
import { useSession } from "next-auth/react"

interface User {
  id?: string
  name?: string | null
  email?: string | null
  picture?: string | null
  sub?: string | null
}

interface Session {
  user?: User
}

export const useAuth = async () => {
  const session: Session | null = await auth();
  return session;
};

export const useAuthSession = () => {
  const { data: session } : {data: Session | null} = useSession();
  return session;
};
