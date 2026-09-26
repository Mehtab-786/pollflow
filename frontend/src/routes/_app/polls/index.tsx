import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/polls/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/polls/"!</div>
}
