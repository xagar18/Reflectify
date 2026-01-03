import axios from "axios";
import { create } from "zustand";

// Interface defining the structure of the authentication state
interface AuthState {
  userData: any | null; // Stores user data or null if not authenticated
  isAuthenticated: boolean; // Boolean flag for authentication status
  auth: (data: any) => void; // Function to set user data and mark as authenticated
  logout: () => void; // Function to log out user by clearing data and authentication flag
  getProfile: () => Promise<void>; // Function to fetch user profile from backend
}

// Create Zustand store for managing authentication state
const useStore = create<AuthState>(set => ({
  userData: null, // Initial state: no user data
  isAuthenticated: false, // Initial state: not authenticated
  // Function to authenticate user by setting user data and authentication flag
  auth: data => set({ userData: data, isAuthenticated: true }),
  // Async function to fetch user profile from backend and update state
  getProfile: async () => {
    // Make GET request to backend profile endpoint
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/profile`,
      { withCredentials: true } // Include cookies for authentication
    );

    // Update state with fetched user data and set authenticated to true
    set({ userData: response.data.user, isAuthenticated: true });

    // Debug log for user data (consider removing in production)
    console.log(response.data.user);
  },
  // Function to log out user by clearing user data and authentication flag
  logout: async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
      {},
      { withCredentials: true } // Include cookies for authentication
    );

    // Clear user data and set authenticated to false
    set({ userData: null, isAuthenticated: false });

    // Debug log for logout response (consider removing in production)
    console.log(response.data);
  },
}));

export default useStore;
