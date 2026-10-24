import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { getMyPolls } from "../services/poll.service"
import PollCard from "../components/PollCard"
import type { PollItem } from "../types/poll.types"
import "../styles/dashboard.styles.css"

export default function Dashboard() {
    const { isPending, isError, data, error, refetch } = useQuery({
        queryKey: ['my-polls'],
        queryFn: getMyPolls
    })

    // ── 1. Loading Skeleton State ─────────────────────────────
    if (isPending) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="dashboard-title-group">
                        <div className="skeleton-shimmer skeleton-header-title" />
                        <div className="skeleton-shimmer skeleton-header-subtitle" />
                    </div>
                    <div className="loading-indicator-badge">
                        <span className="loading-spinner-dot" />
                        Loading polls...
                    </div>
                </div>

                <div className="skeleton-grid">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="skeleton-card">
                            <div className="skeleton-card-top">
                                <div className="skeleton-shimmer skeleton-badge" />
                                <div className="skeleton-shimmer skeleton-date" />
                            </div>
                            <div className="skeleton-shimmer skeleton-card-title" />
                            <div className="skeleton-shimmer skeleton-card-title-short" />
                            <div className="skeleton-card-meta">
                                <div className="skeleton-shimmer skeleton-card-chip" />
                                <div className="skeleton-shimmer skeleton-card-chip" />
                            </div>
                            <div className="skeleton-card-footer">
                                <div className="skeleton-shimmer skeleton-btn" />
                                <div className="skeleton-shimmer skeleton-btn" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // ── 2. Error State with Retry ─────────────────────────────
    if (isError) {
        return (
            <div className="dashboard-container">
                <div className="error-wrapper">
                    <div className="error-card">
                        <div className="error-icon-wrapper">
                            <svg
                                width="28"
                                height="28"
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

                        <h2 className="error-title">Unable to Load Polls</h2>
                        <p className="error-description">
                            We encountered an issue while retrieving your polls. Please check your connection or try again.
                        </p>

                        <div className="error-detail-box">
                            {error?.message || "An unexpected error occurred"}
                        </div>

                        <div className="error-actions">
                            <button className="btn-retry" onClick={() => refetch()}>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                    <path d="M16 21h5v-5" />
                                </svg>
                                Try Again
                            </button>

                            <Link to="/" className="btn-secondary">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const polls: PollItem[] = data?.data?.polls ?? []

    // ── 3. Main Dashboard View with Polls Grid ────────────────
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="dashboard-title-group">
                    <h1>My Polls</h1>
                    <p>Manage and track responses for all your created polls.</p>
                </div>
            </div>

            {polls.length === 0 ? (
                <div className="dashboard-empty-card">
                    <div className="empty-icon-wrapper">
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
                            <path d="M18 20V10" />
                            <path d="M12 20V4" />
                            <path d="M6 20v-6" />
                        </svg>
                    </div>
                    <h3 className="empty-title">No Polls Created Yet</h3>
                    <p className="empty-subtitle">
                        You haven't created any polls yet. When you create polls, they will appear here.
                    </p>
                </div>
            ) : (
                <div className="polls-grid">
                    {polls.map((poll) => (
                        <PollCard key={poll.id} poll={poll} />
                    ))}
                </div>
            )}
        </div>
    )
}


