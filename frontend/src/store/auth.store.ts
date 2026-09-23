import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthContext } from '../types/auth.types'

export const useAuthStore = create<AuthContext>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: (user) => set(
                { user, isAuthenticated: true }
            ),
            logout: () => set(
                { user: null, isAuthenticated: false }
            )

        }),
        { name: 'auth-storage' }, // localStorage key
    ),
)

