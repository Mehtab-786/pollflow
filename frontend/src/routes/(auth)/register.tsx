import { createFileRoute, redirect } from '@tanstack/react-router'
import Register from '../../pages/Register'

export const Route = createFileRoute('/(auth)/register')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: ({ context, search }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: search.redirect })
    }
  },
  component: Register,
})
