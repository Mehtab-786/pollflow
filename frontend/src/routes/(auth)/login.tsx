import { createFileRoute, redirect } from '@tanstack/react-router'
import Login from '../../pages/Login'

type LoginSearch = {
  redirect?: string
  returnTo?: string
}

export const Route = createFileRoute('/(auth)/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: (search.redirect as string) || undefined,
    returnTo: (search.returnTo as string) || undefined,
  }),
  beforeLoad: ({ context, search }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: (search.returnTo || search.redirect || '/') as any })
    }
  },
  component: Login,
})

