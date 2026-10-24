import { createFileRoute } from '@tanstack/react-router'
import Poll from '../pages/Poll'

export const Route = createFileRoute('/polls/$pollId')({
  component: Poll,
})
