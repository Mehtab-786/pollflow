import { useQuery } from '@tanstack/react-query'
import { getAllPublishedPolls } from '../services/poll.service'
import PublishedPollCard from '../components/PublishedPollCard'
import type { PublishedPoll } from '../types/poll.types'
import '../styles/publishedPolls.styles.css'

export default function PublishedPolls() {
    const { isPending, isError, data, error, refetch } = useQuery({
        queryKey: ['published-polls'],
        queryFn: getAllPublishedPolls,
    })

    // ── 1. Loading Skeleton State ─────────────────────────────
    if (isPending) {
        return (
            <main className="published-polls-container" aria-busy="true" aria-label="Loading published polls">
                <header className="published-polls-header">
                    <div className="published-eyebrow">
                        <span className="eyebrow-dot" />
                        Community Results
                    </div>
                    <div className="published-polls-title-group">
                        <div className="skeleton-shimmer" style={{ width: '260px', height: '36px', marginBottom: '8px' }} />
                        <div className="skeleton-shimmer" style={{ width: '420px', height: '18px' }} />
                    </div>
                </header>

                <div className="published-polls-grid">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="skeleton-published-card">
                            <div className="skeleton-row-between">
                                <div className="skeleton-shimmer" style={{ width: '70px', height: '24px', borderRadius: '6px' }} />
                                <div className="skeleton-shimmer" style={{ width: '80px', height: '22px', borderRadius: '9999px' }} />
                            </div>
                            <div className="skeleton-shimmer" style={{ width: '90%', height: '22px', marginTop: '4px' }} />
                            <div className="skeleton-shimmer" style={{ width: '60%', height: '20px' }} />
                            <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9' }}>
                                <div className="skeleton-shimmer" style={{ flex: 1, height: '38px', borderRadius: '9px' }} />
                                <div className="skeleton-shimmer" style={{ width: '38px', height: '38px', borderRadius: '9px' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        )
    }

    // ── 2. Error State with Retry ─────────────────────────────
    if (isError) {
        return (
            <main className="published-polls-container">
                <header className="published-polls-header">
                    <div className="published-eyebrow">
                        <span className="eyebrow-dot" />
                        Community Results
                    </div>
                    <div className="published-polls-title-group">
                        <h1>Published Polls</h1>
                        <p>Explore expired polls and view finalized voting outcomes from the PollFlow community.</p>
                    </div>
                </header>

                <div className="published-error-card" role="alert">
                    <div className="published-error-icon" aria-hidden="true">
                        <svg
                            width="26"
                            height="26"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h2 className="empty-title">Failed to Load Published Polls</h2>
                    <p className="empty-subtitle">
                        {error instanceof Error ? error.message : 'Unable to connect to the server. Please try again.'}
                    </p>
                    <button
                        type="button"
                        className="btn-view-result"
                        style={{ marginTop: '20px', maxWidth: '160px' }}
                        onClick={() => refetch()}
                    >
                        Try Again
                    </button>
                </div>
            </main>
        )
    }

    const polls: PublishedPoll[] = data?.data?.polls ?? data?.polls ?? []

    // ── 3. Main View with Polls Grid ──────────────────────────
    return (
        <main className="published-polls-container">
            {/* Header */}
            <header className="published-polls-header">
                <div className="published-eyebrow">
                    <span className="eyebrow-dot" />
                    Community Archive
                </div>
                <div className="published-polls-title-group">
                    <h1>Published Polls</h1>
                    <p>
                        Browse expired community polls, explore public opinions, and inspect verified voting results.
                    </p>
                </div>
            </header>

            {/* Empty State: No Polls Available */}
            {polls.length === 0 ? (
                <div className="published-empty-card">
                    <div className="empty-icon-circle" aria-hidden="true">
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </div>
                    <h2 className="empty-title">No Published Polls Yet</h2>
                    <p className="empty-subtitle">
                        When expired polls are published by their creators to show results to the public, they will appear here.
                    </p>
                </div>
            ) : (
                /* Grid of Published Poll Cards */
                <section className="published-polls-grid" aria-label="Published polls list">
                    {polls.map((poll) => (
                        <PublishedPollCard key={poll.id} poll={poll} />
                    ))}
                </section>
            )}
        </main>
    )
}
