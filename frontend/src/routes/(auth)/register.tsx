import { createFileRoute, redirect } from '@tanstack/react-router'
import Register from '../../pages/Register'

type RegisterSearch = {
  redirect?: string
}

export const Route = createFileRoute('/(auth)/register')({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: ({ context, search }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: search.redirect || '/' })
    }
  },
  component: Register,
})
