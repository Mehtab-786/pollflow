import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";


interface RouterContext {
    isAuthenticated: boolean
    isInitialized: boolean
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => <Outlet />,
});
