import { createFileRoute, redirect } from '@tanstack/react-router'
import Login from '../../pages/Login'

export const Route = createFileRoute('/(auth)/login')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: ({ context, search }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: search.redirect })
    }
  },
  component: Login,
})

