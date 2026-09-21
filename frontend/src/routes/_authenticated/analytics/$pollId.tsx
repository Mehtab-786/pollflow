import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/analytics/$pollId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/analytics/$pollId"!</div>
}
