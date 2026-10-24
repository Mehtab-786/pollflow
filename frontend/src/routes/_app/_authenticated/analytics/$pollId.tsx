import { createFileRoute } from '@tanstack/react-router'
import Analytics from '../../../../pages/Analytics'

export const Route = createFileRoute(
  '/_app/_authenticated/analytics/$pollId',
)({
  component: Analytics,
})
