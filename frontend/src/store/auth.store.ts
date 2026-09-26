import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthContext } from '../types/auth.types'

export const useAuthStore = create<AuthContext>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isInitialized: false,

            login: (user) => set({
                user,
                isAuthenticated: true,
                isInitialized: true,
            }),
            logout: () => set({
                user: null,
                isAuthenticated: false,
                isInitialized: true,
            }),
            setInitialized: (isInitialized) => set({ isInitialized }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
)

