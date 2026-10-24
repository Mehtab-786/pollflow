import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { PublishedPoll } from '../types/poll.types'

interface PublishedPollCardProps {
    poll: PublishedPoll
}

export default function PublishedPollCard({ poll }: PublishedPollCardProps) {
    const navigate = useNavigate()
    const [copied, setCopied] = useState(false)

    const handleViewResult = () => {
        navigate({
            to: '/polls/$pollId',
            params: { pollId: poll.id },
        })
    }

    const handleCopyLink = async (e: React.MouseEvent) => {
        e.stopPropagation()
        const url = `${window.location.origin}/polls/${poll.id}`
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(url)
            } else {
                const textArea = document.createElement('textarea')
                textArea.value = url
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)
            }
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy link:', err)
        }
    }

    const formattedExpiry = poll.expiresAt
        ? new Date(poll.expiresAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          })
        : null

    const creatorName = poll.creator?.username || 'Community Member'
    const creatorInitial = creatorName.charAt(0).toUpperCase()
    const responseCount = poll._count?.responses ?? 0
    const questionCount = poll._count?.questions ?? 0

    return (
        <article
            className="published-poll-card"
            onClick={handleViewResult}
            tabIndex={0}
            role="button"
            aria-label={`View results for ${poll.title}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleViewResult()
                }
            }}
        >
            {/* Top Row: Type & Response Stats (No expired tag per requirement) */}
            <div className="published-poll-header">
                <span className="poll-type-tag">
                    {poll.type === 'QUIZ' ? (
                        <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="6" />
                                <circle cx="12" cy="12" r="2" />
                            </svg>
                            Quiz
                        </>
                    ) : (
                        <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10" />
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                            Poll
                        </>
                    )}
                </span>

                <div className="poll-stats-pill" title={`${responseCount} total participant responses`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>{responseCount} {responseCount === 1 ? 'vote' : 'votes'}</span>
                </div>
            </div>

            {/* Poll Title */}
            <h3 className="published-poll-title" title={poll.title}>
                {poll.title}
            </h3>

            {/* Creator and Expiration Metadata */}
            <div className="published-poll-meta">
                {/* Creator info */}
                <div className="poll-creator-item" title={`Created by ${creatorName}`}>
                    <div className="creator-avatar" aria-hidden="true">
                        {creatorInitial}
                    </div>
                    <span className="creator-name">@{creatorName}</span>
                </div>

                {/* Expired date */}
                {formattedExpiry && (
                    <div className="poll-expiry-item" title={`Poll expired on ${formattedExpiry}`}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>Expired: {formattedExpiry}</span>
                    </div>
                )}

                {/* Questions count */}
                {questionCount > 0 && (
                    <div className="poll-questions-count" title={`${questionCount} questions in this poll`}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <span>{questionCount} {questionCount === 1 ? 'question' : 'questions'}</span>
                    </div>
                )}
            </div>

            {/* Card Footer: View Result button & Share */}
            <div className="published-poll-footer">
                <button
                    type="button"
                    id={`view-result-${poll.id}`}
                    className="btn-view-result"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleViewResult()
                    }}
                >
                    <span>View Result</span>
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="btn-arrow-icon"
                    >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </button>

                <button
                    type="button"
                    className={`btn-share-icon ${copied ? 'copied' : ''}`}
                    onClick={handleCopyLink}
                    title={copied ? 'Link copied!' : 'Share poll result'}
                    aria-label="Share poll result link"
                >
                    {copied ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                    )}
                </button>
            </div>
        </article>
    )
}
