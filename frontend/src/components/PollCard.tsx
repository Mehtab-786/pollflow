import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { publishPoll } from "../services/poll.service"
import { toast } from "sonner"
import type { PollCardProps } from "../types/poll.types"
import { copyToClipboard } from "../utils/clipboard"


export default function PollCard({ poll }: PollCardProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [isCopied, setIsCopied] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [isPublished, setIsPublished] = useState(poll.isPublished)

    useEffect(() => {
        setIsPublished(poll.isPublished)
    }, [poll.isPublished])

    const isExpired = poll.expiresAt ? new Date() > new Date(poll.expiresAt) : false
    const canPublish = isExpired && !isPublished
    const formattedDate = new Date(poll.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

    const handlePublish = async () => {
        try {
            setIsPublishing(true)
            await publishPoll(poll.id)
            setIsPublished(true)
            queryClient.invalidateQueries({ queryKey: ['my-polls'] })
            queryClient.invalidateQueries({ queryKey: ['published-polls'] })
        } catch (err: any) {
            console.error("Failed to publish poll:", err)
            toast.error(err?.response?.data?.message || err?.message || "Failed to publish poll")
        } finally {
            setIsPublishing(false)
        }
    }

    const handleCopyShareUrl = async () => {
        const url = `${window.location.origin}/polls/${poll.id}`
        const success = await copyToClipboard(url)
        if (success) {
            setIsCopied(true)
            setTimeout(() => {
                setIsCopied(false)
            }, 2000)
        }
    }

    return (
        <div className="poll-card">
            {/* Top Row: Title (Left) & Status (Right: Expired or Ongoing) */}
            <div className="poll-card-header">
                <h3 className="poll-card-title" title={poll.title}>
                    {poll.title}
                </h3>
                <span className={`status-badge ${isExpired ? 'status-expired' : 'status-ongoing'}`}>
                    {!isExpired && <span className="status-dot" />}
                    {isExpired ? 'Expired' : 'Ongoing'}
                </span>
            </div>

            {/* Bottom Row: Created at (Left), Type (Center), Publish (Right) */}
            <div className="poll-card-footer">
                {/* Left: Created at */}
                <div className="poll-created-at" title={`Created on ${formattedDate}`}>
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{formattedDate}</span>
                </div>

                {/* Center: Type */}
                <div className="poll-type-badge">
                    {poll.type}
                </div>

                {/* Right: Publish action or published status */}
                <div className="poll-card-action">
                    <button
                        type="button"
                        className="btn-analytics-card"
                        onClick={() => {
                            navigate({
                                to: '/analytics/$pollId',
                                params: { pollId: poll.id },
                            })
                        }}
                    >
                        {isExpired ? 'View result' : 'Analytics'}
                    </button>

                    {canPublish ? (
                        <button
                            type="button"
                            className="btn-publish-card"
                            disabled={isPublishing}
                            onClick={handlePublish}
                        >
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                            {isPublishing ? 'Publishing...' : 'Publish'}
                        </button>
                    ) : isPublished ? (
                        <span className="badge-published" title="Poll is published">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Published
                        </span>
                    ) : (
                        <button
                            type="button"
                            className={`btn-share-card ${isCopied ? 'copied' : ''}`}
                            title={isCopied ? "Copied to clipboard!" : "Share poll"}
                            onClick={handleCopyShareUrl}
                        >
                            {isCopied ? (
                                <>
                                    <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="18" cy="5" r="3" />
                                        <circle cx="6" cy="12" r="3" />
                                        <circle cx="18" cy="19" r="3" />
                                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                    </svg>
                                    Share
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
