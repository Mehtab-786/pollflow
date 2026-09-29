import { createFileRoute } from '@tanstack/react-router'
import CreatePoll from '../../../pages/CreatePoll'

export const Route = createFileRoute('/_app/_authenticated/create-poll')({
  component: CreatePoll,
})

