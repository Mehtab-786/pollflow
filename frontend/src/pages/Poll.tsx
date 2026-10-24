import { useState, useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { getPollById } from '../services/poll.service'
import { useAuthStore } from '../store/auth.store'
import '../styles/poll.styles.css'
import { submitPollResponse } from '../services/response.service'
import { toast } from 'sonner'

export interface OptionData {
    id: string
    text: string
    votesCount?: number
}

export interface QuestionData {
    id: string
    question: string
    position: number
    isRequired: boolean
    type: string
    selectionMode: string
    options: OptionData[]
}

export interface PollData {
    id: string
    title: string
    type: string
    responseMode: string
    expiresAt: string | null
    isPublished: boolean
    isExpired: boolean
    isCreator: boolean
    createdAt: string
    creator: {
        id: string
        username: string
        email: string
    }
    totalResponses?: number
    questions: QuestionData[]
}

export default function Poll() {
    const { pollId } = useParams({ from: '/polls/$pollId' })
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthStore()

    const [viewMode, setViewMode] = useState<'questions' | 'result'>('questions')
    const [poll, setPoll] = useState<PollData | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState<boolean>(false)
    const [answers, setAnswers] = useState<Record<string, string[]>>({})
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    const handleSubmitResponse = async () => {
        if (!pollId || !poll) return

        const backendAnswers = Object.entries(answers).flatMap(([questionId, optionIds]) =>
            optionIds.map((optionId) => ({ questionId, optionId }))
        )

        if (backendAnswers.length === 0) {
            toast.warning('Please select at least one option before submitting.')
            return
        }

        const requiredQuestions = poll.questions.filter((q) => q.isRequired)

        for (const q of requiredQuestions) {
            const hasAnswer = answers[q.id] && answers[q.id].length > 0
            if (!hasAnswer) {
                toast.error(`Please answer the required question: "${q.question}"`)
                return
            }
        }

        try {
            setIsSubmitting(true)
            const res = await submitPollResponse(pollId, { answers: backendAnswers })

            if (res.success) {
                setIsSubmitted(true)
            }
        } catch (error: any) {
            console.error(error)
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to submit response'
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }



    const handleOptionToggle = (questionId: string, optionId: string, selectionMode: string) => {
        setAnswers((prev) => {
            const current = prev[questionId] || []
            if (selectionMode === 'MULTIPLE') {
                const exists = current.includes(optionId)
                const next = exists ? current.filter((id) => id !== optionId) : [...current, optionId]
                return { ...prev, [questionId]: next }
            } else {
                return { ...prev, [questionId]: [optionId] }
            }
        })
    }

    const fetchPoll = async () => {
        if (!pollId) return
        try {
            setLoading(true)
            setError(null)
            const res = await getPollById(pollId)
            const data: PollData = res?.data?.poll || res?.poll || res

            setPoll(data)

            // If creator, automatically redirect to dedicated Analytics dashboard
            if (data.isCreator) {
                navigate({
                    to: '/analytics/$pollId',
                    params: { pollId },
                })
                return
            }

            // If authenticated response mode and user is not logged in, redirect to login
            if (data.responseMode === 'AUTHENTICATED' && !isAuthenticated) {
                navigate({
                    to: '/login',
                    search: { returnTo: `/polls/${pollId}` }
                })
                return
            }

            // If expired, show read-only result view (for non-owner)
            if (data.isExpired) {
                setViewMode('result')
            } else {
                setViewMode('questions')
            }
        } catch (err: any) {
            console.error('Failed to fetch poll:', err)
            setError(err?.response?.data?.message || err?.message || 'Failed to load poll')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPoll()
    }, [pollId, isAuthenticated])



    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // ── 1. Loading State ──────────────────────────────────────
    if (loading) {
        return (
            <div className="poll-page-container">
                <div className="poll-loading-box">
                    <div className="poll-spinner" />
                    <p>Loading poll details...</p>
                </div>
            </div>
        )
    }

    // ── 2. Error State ────────────────────────────────────────
    if (error || !poll) {
        return (
            <div className="poll-page-container">
                <div className="poll-error-box">
                    <h3>Unable to Load Poll</h3>
                    <p>{error || 'Poll not found or unavailable'}</p>
                    <button className="poll-retry-btn" onClick={fetchPoll}>
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    // ── 3. Submitted Success View ─────────────────────────────
    if (isSubmitted) {
        return (
            <div className="poll-page-container">
                <div className="poll-success-box">
                    <div className="poll-success-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 className="poll-success-title">Poll Response Submitted!</h2>
                    <p className="poll-success-desc">
                        Thank you for your response. Your answers for <strong>"{poll.title}"</strong> have been recorded.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '18px' }}>
                        <button
                            type="button"
                            className="poll-retry-btn"
                            onClick={() => navigate({ to: '/polls' })}
                        >
                            Browse More Polls
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ── 4. Result View (Creator or Expired) ────────────────────
    if (viewMode === 'result') {
        const totalResponses = poll.totalResponses ?? 0

        return (
            <div className="poll-page-container">
                {/* Poll Header Card */}
                <div className="poll-header-card">
                    <div className="poll-badges-row">
                        {poll.isCreator && (
                            <span className="poll-badge badge-creator">
                                👑 Creator View
                            </span>
                        )}
                        {poll.isExpired ? (
                            <span className="poll-badge badge-expired">
                                <span className="badge-dot" /> Closed
                            </span>
                        ) : (
                            <span className="poll-badge badge-active">
                                <span className="badge-dot" /> Live Poll
                            </span>
                        )}
                        <span className="poll-badge badge-mode">
                            {poll.responseMode === 'AUTHENTICATED' ? '🔒 Authenticated' : '👤 Anonymous'}
                        </span>
                        <span className="poll-badge badge-mode">
                            {poll.type === 'QUIZ' ? '🎯 Quiz' : '📊 Poll'}
                        </span>
                    </div>

                    <h1 className="poll-header-title">{poll.title}</h1>

                    <div className="poll-meta-row">
                        <div className="poll-meta-left">
                            <span className="poll-meta-item">
                                <strong>Created by:</strong> @{poll.creator?.username || 'Unknown'}
                            </span>
                            <span className="poll-meta-item">
                                <strong>Total Responses:</strong> {totalResponses}
                            </span>
                            {poll.expiresAt && (
                                <span className="poll-meta-item">
                                    <strong>{poll.isExpired ? 'Ended on:' : 'Expires:'}</strong>{' '}
                                    {new Date(poll.expiresAt).toLocaleDateString(undefined, {
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
                            onClick={handleCopyLink}
                            title="Copy shareable link"
                        >
                            {copied ? (
                                <>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                    Share Link
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Informational Banner */}
                {poll.isExpired && (
                    <div className="poll-notice-banner banner-expired">
                        <span className="banner-icon">⏳</span>
                        <div>
                            <strong>Poll Closed:</strong> This poll is no longer accepting new submissions. Below are the final verified results.
                        </div>
                    </div>
                )}

                {/* Results Section */}
                <div className="results-section-header">
                    <h2 className="results-section-title">Results Breakdown</h2>
                    <span className="results-count-pill">
                        {poll.questions.length} {poll.questions.length === 1 ? 'Question' : 'Questions'}
                    </span>
                </div>

                <div className="results-questions-grid">
                    {poll.questions.map((q) => {
                        const questionTotalVotes = q.options.reduce(
                            (sum, opt) => sum + (opt.votesCount || 0),
                            0
                        )
                        const maxVotes = Math.max(...q.options.map((opt) => opt.votesCount || 0))

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
                                        const count = opt.votesCount || 0
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
                                                                ★ Top
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

    // ── 4. Questions View (Participant answering poll) ────────
    return (
        <div className="poll-page-container">
            {/* Poll Header Card */}
            <div className="poll-header-card">
                <div className="poll-badges-row">
                    <span className="poll-badge badge-active">
                        <span className="badge-dot" /> Live Poll
                    </span>
                    <span className="poll-badge badge-mode">
                        {poll.responseMode === 'AUTHENTICATED' ? '🔒 Authenticated' : '👤 Anonymous'}
                    </span>
                    <span className="poll-badge badge-mode">
                        {poll.type === 'QUIZ' ? '🎯 Quiz' : '📊 Poll'}
                    </span>
                </div>

                <h1 className="poll-header-title">{poll.title}</h1>

                <div className="poll-meta-row">
                    <div className="poll-meta-left">
                        <span className="poll-meta-item">
                            <strong>Created by:</strong> @{poll.creator?.username || 'Unknown'}
                        </span>
                        {poll.expiresAt && (
                            <span className="poll-meta-item">
                                <strong>Expires:</strong>{' '}
                                {new Date(poll.expiresAt).toLocaleDateString(undefined, {
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
                        onClick={handleCopyLink}
                        title="Copy shareable link"
                    >
                        {copied ? (
                            <>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                Share Link
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Questions Section Header */}
            <div className="results-section-header">
                <h2 className="results-section-title">Questions</h2>
                <span className="results-count-pill">
                    {poll.questions.length} {poll.questions.length === 1 ? 'Question' : 'Questions'}
                </span>
            </div>

            {/* Questions List */}
            <div className="results-questions-grid">
                {poll.questions.map((q) => {
                    const isMulti = q.selectionMode === 'MULTIPLE'
                    const selectedOptions = answers[q.id] || []

                    return (
                        <div key={q.id} className="poll-question-card">
                            <div className="result-question-header">
                                <div className="result-question-title-box">
                                    <span className="result-q-position">Q{q.position}</span>
                                    <h3 className="result-q-text">
                                        {q.question}
                                        {q.isRequired && <span className="required-star">*</span>}
                                    </h3>
                                </div>
                                <div className="result-q-meta">
                                    <span className="result-chip">
                                        {isMulti ? 'Multi-select' : 'Single-select'}
                                    </span>
                                    {q.isRequired && <span className="result-chip required-chip">Required</span>}
                                </div>
                            </div>

                            <div className="poll-options-list">
                                {q.options.map((opt, optIndex) => {
                                    const isSelected = selectedOptions.includes(opt.id)
                                    const optionLetter = String.fromCharCode(65 + optIndex)

                                    return (
                                        <button
                                            type="button"
                                            key={opt.id}
                                            className={`poll-option-btn ${isSelected ? 'selected' : ''}`}
                                            onClick={() => handleOptionToggle(q.id, opt.id, q.selectionMode)}
                                        >
                                            <span className={`poll-option-indicator ${isMulti ? 'square' : ''}`}>
                                                {isSelected && !isMulti && <span className="poll-option-indicator-inner" />}
                                                {isSelected && isMulti && (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </span>
                                            <span className="poll-option-letter">{optionLetter}</span>
                                            <span className="poll-option-text">{opt.text}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Submit Button */}
            <div className="poll-submit-bar">
                <button
                    type="button"
                    className="poll-submit-btn"
                    disabled={isSubmitting}
                    onClick={handleSubmitResponse}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </div>
    )
}


