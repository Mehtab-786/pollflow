import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { getPollAnalytics } from '../services/poll.service'
import { refreshAuthToken } from '../services/api/axios'
import { socket } from '../socket/socket'
import '../styles/poll.styles.css'

export interface AnalyticsOption {
    id: string
    text: string
    votes: number
    votesCount: number
    percentage: number
}

export interface AnalyticsQuestion {
    id: string
    question: string
    position: number
    isRequired: boolean
    type: string
    selectionMode: string
    totalVotes: number
    totalAnswers?: number
    options: AnalyticsOption[]
}

export interface AnalyticsData {
    id: string
    title: string
    type: string
    responseMode: string
    expiresAt: string | null
    isPublished: boolean
    createdAt: string
    creator: {
        id: string
        username: string
    }
    totalResponses: number
    questions: AnalyticsQuestion[]
}

export default function Analytics() {
    const { pollId } = useParams({ from: '/_app/_authenticated/analytics/$pollId' })
    const navigate = useNavigate()

    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState<boolean>(false)
    const [isLiveConnected, setIsLiveConnected] = useState<boolean>(() => socket.connected)

    const fetchAnalytics = async () => {
        if (!pollId) return
        try {
            setLoading(true)
            setError(null)
            const res = await getPollAnalytics(pollId)
            const data: AnalyticsData = res?.data?.analytics || res?.analytics || res
            setAnalytics(data)
        } catch (err: any) {
            console.error('Failed to fetch poll analytics:', err)
            setError(err?.response?.data?.message || err?.message || 'Failed to load poll analytics')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, [pollId])

    useEffect(() => {
        if (!pollId) return

        const handleConnect = () => {
            setIsLiveConnected(true)
            // Re-join the analytics room on initial connect and every reconnect
            socket.emit('join_poll_analytics', { pollId })
        }

        const handleDisconnect = () => {
            setIsLiveConnected(false)
        }

        const handleConnectError = async (err: Error) => {
            setIsLiveConnected(false)
            console.error('Socket connection failed:', err.message)

            // If handshake failed due to expired/missing token, refresh token and retry connecting
            if (err.message?.includes('Unauthorized') || err.message?.includes('expired') || err.message?.includes('token')) {
                try {
                    await refreshAuthToken()
                    socket.connect()
                } catch {
                    // Refresh token invalid or expired; refreshAuthToken automatically logs user out
                }
            }
        }

        socket.on('connect', handleConnect)
        socket.on('disconnect', handleDisconnect)
        socket.on('connect_error', handleConnectError)

        if (socket.connected) {
            socket.emit('join_poll_analytics', { pollId })
        } else {
            socket.connect()
        }

        const handleAnalyticsUpdate = (data: any) => {
            setAnalytics((prev) => {
                if (!prev) return prev

                // Tally increments for options from answers in this vote
                const optionVoteIncrements = new Map<string, number>()
                data.answers?.forEach((ans: { optionId?: string | null }) => {
                    if (ans.optionId) {
                        optionVoteIncrements.set(
                            ans.optionId,
                            (optionVoteIncrements.get(ans.optionId) || 0) + 1
                        )
                    }
                })

                const newTotalResponses = (prev.totalResponses || 0) + (data.totalResponsesIncrement || 1)

                return {
                    ...prev,
                    totalResponses: newTotalResponses,
                    questions: prev.questions.map((question) => {
                        const updatedOptions = question.options.map((option) => {
                            const increment = optionVoteIncrements.get(option.id) || 0
                            const newCount = (option.votesCount || option.votes || 0) + increment
                            return {
                                ...option,
                                votes: newCount,
                                votesCount: newCount,
                            }
                        })

                        const questionTotalVotes = updatedOptions.reduce(
                            (sum, opt) => sum + (opt.votesCount || opt.votes || 0),
                            0
                        )

                        return {
                            ...question,
                            totalVotes: questionTotalVotes,
                            options: updatedOptions.map((opt) => ({
                                ...opt,
                                percentage:
                                    questionTotalVotes > 0
                                        ? Number((((opt.votesCount || opt.votes || 0) / questionTotalVotes) * 100).toFixed(1))
                                        : 0,
                            })),
                        }
                    }),
                }
            })
        }

        socket.on('poll:analytics_update', handleAnalyticsUpdate)

        return () => {
            socket.off('connect', handleConnect)
            socket.off('disconnect', handleDisconnect)
            socket.off('connect_error', handleConnectError)
            socket.off('poll:analytics_update', handleAnalyticsUpdate)
            socket.emit('leave_poll_analytics', { pollId })
            socket.disconnect()
        }
    }, [pollId])

    const handleCopyVotingLink = () => {
        const publicUrl = `${window.location.origin}/polls/${pollId}`
        navigator.clipboard.writeText(publicUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // ── 1. Loading State ──────────────────────────────────────
    if (loading) {
        return (
            <div className="poll-page-container">
                <div className="poll-loading-box">
                    <div className="poll-spinner" />
                    <p>Loading real-time analytics...</p>
                </div>
            </div>
        )
    }

    // ── 2. Error State ────────────────────────────────────────
    if (error || !analytics) {
        return (
            <div className="poll-page-container">
                <div className="poll-error-box">
                    <h3>Unable to Load Analytics</h3>
                    <p>{error || 'Poll not found or unauthorized'}</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '14px' }}>
                        <button className="poll-retry-btn" onClick={fetchAnalytics}>
                            Try Again
                        </button>
                        <button
                            className="poll-retry-btn"
                            style={{ background: '#f1f5f9', color: '#475569' }}
                            onClick={() => navigate({ to: '/dashboard' })}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const isExpired = Boolean(analytics.expiresAt && new Date() > new Date(analytics.expiresAt))
    const totalResponses = analytics.totalResponses ?? 0

    // ── 3. Main Analytics Dashboard ───────────────────────────
    return (
        <div className="poll-page-container">
            {/* Top Navigation Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Link
                    to="/dashboard"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#475569',
                        textDecoration: 'none',
                        padding: '6px 12px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        transition: 'all 0.15s ease',
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Dashboard
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: isLiveConnected ? '#16a34a' : '#d97706',
                            background: isLiveConnected ? '#f0fdf4' : '#fffbeb',
                            border: `1px solid ${isLiveConnected ? '#bbf7d0' : '#fef3c7'}`,
                            padding: '4px 10px',
                            borderRadius: '9999px',
                        }}
                    >
                        <span
                            style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                background: isLiveConnected ? '#16a34a' : '#d97706',
                                animation: isLiveConnected ? 'pulse 2s infinite' : 'none',
                            }}
                        />
                        {isLiveConnected ? 'Live Updates Active' : 'Connecting WebSocket...'}
                    </span>
                </div>
            </div>

            {/* Poll Header Card */}
            <div className="poll-header-card">
                <div className="poll-badges-row">
                    <span className="poll-badge badge-creator">
                        👑 Creator Analytics
                    </span>
                    {isExpired ? (
                        <span className="poll-badge badge-expired">
                            <span className="badge-dot" /> Closed
                        </span>
                    ) : (
                        <span className="poll-badge badge-active">
                            <span className="badge-dot" /> Live Poll
                        </span>
                    )}
                    <span className="poll-badge badge-mode">
                        {analytics.responseMode === 'AUTHENTICATED' ? '🔒 Authenticated' : '👤 Anonymous'}
                    </span>
                    <span className="poll-badge badge-mode">
                        {analytics.type === 'QUIZ' ? '🎯 Quiz' : '📊 Poll'}
                    </span>
                </div>

                <h1 className="poll-header-title">{analytics.title}</h1>

                <div className="poll-meta-row">
                    <div className="poll-meta-left">
                        <span className="poll-meta-item">
                            <strong>Total Responses:</strong> {totalResponses}
                        </span>
                        <span className="poll-meta-item">
                            <strong>Questions:</strong> {analytics.questions.length}
                        </span>
                        {analytics.expiresAt && (
                            <span className="poll-meta-item">
                                <strong>{isExpired ? 'Ended on:' : 'Expires:'}</strong>{' '}
                                {new Date(analytics.expiresAt).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        className={`poll-share-btn ${copied ? 'copied' : ''}`}
                        onClick={handleCopyVotingLink}
                        title="Copy public voter link"
                    >
                        {copied ? (
                            <>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Voting Link Copied!
                            </>
                        ) : (
                            <>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                Copy Voting Link
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Creator Overview Banner */}
            <div className="poll-notice-banner banner-creator">
                <span className="banner-icon">⚡</span>
                <div>
                    <strong>Real-Time Analytics Dashboard:</strong> Incoming votes are received and displayed live via WebSockets without refreshing. Share the public voting link to collect more responses.
                </div>
            </div>

            {/* Results Section */}
            <div className="results-section-header">
                <h2 className="results-section-title">Question Breakdown</h2>
                <span className="results-count-pill">
                    {analytics.questions.length} {analytics.questions.length === 1 ? 'Question' : 'Questions'}
                </span>
            </div>

            <div className="results-questions-grid">
                {analytics.questions.map((q) => {
                    const questionTotalVotes = q.options.reduce(
                        (sum, opt) => sum + (opt.votesCount || opt.votes || 0),
                        0
                    )
                    const maxVotes = Math.max(...q.options.map((opt) => opt.votesCount || opt.votes || 0))

                    return (
                        <div key={q.id} className="result-question-card">
                            <div className="result-question-header">
                                <div className="result-question-title-box">
                                    <span className="result-q-position">Q{q.position}</span>
                                    <h3 className="result-q-text">{q.question}</h3>
                                </div>
                                <div className="result-q-meta">
                                    <span className="result-chip">
                                        {q.selectionMode === 'MULTIPLE' ? 'Multi-select' : 'Single-select'}
                                    </span>
                                    <span className="result-votes-total">
                                        {questionTotalVotes} {questionTotalVotes === 1 ? 'vote' : 'votes'}
                                    </span>
                                </div>
                            </div>

                            <div className="result-options-list">
                                {q.options.map((opt) => {
                                    const count = opt.votesCount || opt.votes || 0
                                    const pct =
                                        questionTotalVotes > 0
                                            ? Math.round((count / questionTotalVotes) * 100)
                                            : 0
                                    const isLeading = count === maxVotes && maxVotes > 0

                                    return (
                                        <div
                                            key={opt.id}
                                            className={`result-option-row ${isLeading ? 'leading-option' : ''}`}
                                        >
                                            <div
                                                className="result-progress-fill"
                                                style={{ width: `${pct}%` }}
                                            />
                                            <div className="result-option-content">
                                                <div className="result-option-left">
                                                    <span className="result-option-text">{opt.text}</span>
                                                    {isLeading && (
                                                        <span className="leading-badge">
                                                            ★ Leading
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="result-option-right">
                                                    <span className="result-vote-count">
                                                        {count} {count === 1 ? 'vote' : 'votes'}
                                                    </span>
                                                    <span className="result-percentage">{pct}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}