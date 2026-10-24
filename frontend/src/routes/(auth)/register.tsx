import { createFileRoute, redirect } from '@tanstack/react-router'
import Register from '../../pages/Register'

type RegisterSearch = {
  redirect?: string
  returnTo?: string
}

export const Route = createFileRoute('/(auth)/register')({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => ({
    redirect: (search.redirect as string) || undefined,
    returnTo: (search.returnTo as string) || undefined,
  }),
  beforeLoad: ({ context, search }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: (search.returnTo || search.redirect || '/') as any })
    }
  },
  component: Register,
})
