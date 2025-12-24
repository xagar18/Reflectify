import axios from "axios";
import { create } from "zustand";

interface AuthState {
  userData: any | null;
  isAuthenticated: boolean;
  auth: (data: any) => void;
  getProfile: () => Promise<void>;
}

const useStore = create<AuthState>(set => ({
  userData: null,
  isAuthenticated: false,
  auth: data => set({ userData: data, isAuthenticated: true }),
  getProfile: async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/profile`,
      { withCredentials: true }
    );

    set({ userData: response.data.user, isAuthenticated: true });

    console.log(response.data.user);
  },
}));

export default useStore;
