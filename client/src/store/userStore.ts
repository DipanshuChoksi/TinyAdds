import { create } from "zustand";
import http from "@/lib/http";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  country?: string;
  state?: string;
  city?: string;
  countryId?: string;
  stateId?: string;
  cityId?: string;
  profileImage?: string;
  isAdmin?: boolean;
}

interface UserState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  fetchUser: () => Promise<User | null>;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,

  fetchUser: async () => {
    // If already loading, avoid duplicate concurrent calls
    if (get().loading) return get().user;

    set({ loading: true, error: null });
    try {
      const res = await http.get<User>("/auth/me");
      if (res?.data) {
        set({ user: res.data, loading: false, initialized: true, error: null });
        return res.data;
      }
      set({ user: null, loading: false, initialized: true, error: null });
      return null;
    } catch (err) {
      set({
        user: null,
        loading: false,
        initialized: true,
        error: err instanceof Error ? err.message : "Failed to fetch user",
      });
      return null;
    }
  },

  setUser: (user) => set({ user, initialized: true, loading: false, error: null }),

  clearUser: () => set({ user: null, initialized: true, loading: false, error: null }),
}));
