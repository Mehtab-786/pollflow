import { createFileRoute } from '@tanstack/react-router'
import PublishedPolls from '../../../pages/PublishedPolls'

export const Route = createFileRoute('/_app/polls/')({
  component: PublishedPolls,
})

