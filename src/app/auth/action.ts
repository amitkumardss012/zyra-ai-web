import { api } from "@/hooks/useApi";

export const authAction = async (tokenId: string) => {
  try {
    const res = await api.post("/user/auth/google", {
      idToken: tokenId,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
