import { Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../store/auth.store'
import { logout as apiLogout } from '../services/auth.service'
import '../styles/Navbar.styles.css'

export default function Navbar() {
    const { isAuthenticated, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await apiLogout()
        } catch (error) {
            console.error('Failed to logout on server:', error)
            // Continue client-side logout even if server request fails
        } finally {
            logout()
            navigate({ to: '/' })
        }
    }

    return (
        <header className="navbar">
            <div className="navbar-container">
                {/* Left: Brand Logo & Name */}
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon-wrapper">
                        <svg
                            className="brand-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 20V10" />
                            <path d="M12 20V4" />
                            <path d="M6 20v-6" />
                        </svg>
                    </div>
                    <span className="brand-title">PollFlow</span>
                </Link>

                {/* Center / Navigation Links */}
                <nav className="navbar-menu">
                    <ul className="navbar-links">
                        <li>
                            <Link to="/" activeProps={{ className: 'active' }} className="nav-link">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/polls" activeProps={{ className: 'active' }} className="nav-link">
                                Published Polls
                            </Link>
                        </li>
                        {isAuthenticated && (
                            <>
                                <li>
                                    <Link to="/create-poll" activeProps={{ className: 'active' }} className="nav-link">
                                        Create Poll
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard" activeProps={{ className: 'active' }} className="nav-link">
                                        Dashboard
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                {/* Right: Actions (Login / Logout) */}
                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <button className="nav-logout-btn" onClick={handleLogout} title="Log out">
                            <svg
                                className="nav-logout-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    ) : (
                        <Link to="/login" className="nav-login-btn">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
