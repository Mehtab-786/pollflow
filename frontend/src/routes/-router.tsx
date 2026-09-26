import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'
import { useAuthStore } from '../store/auth.store'

const { isAuthenticated, isInitialized } = useAuthStore.getState()

export const router = createRouter({
    routeTree,
    context: {
        isAuthenticated,
        isInitialized,
    },
})


declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}