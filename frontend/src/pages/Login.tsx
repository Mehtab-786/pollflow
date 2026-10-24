import { useState } from "react"
import * as authService from '../services/auth.service'
import { useAuthStore } from "../store/auth.store"
import { useNavigate, useSearch } from "@tanstack/react-router"
import '../styles/auth.styles.css'
import { toast } from "sonner"

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()
    const search = useSearch({ strict: false }) as { returnTo?: string; redirect?: string }
    const returnTo = search?.returnTo || search?.redirect
    const { login } = useAuthStore()

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            let { success, data } = await authService.login({ email, password })

            if (success) {
                login(data)
                toast.success(`Welcome back, ${data.username}!`)
                navigate({ to: (returnTo || '/') as any })
            }
        } catch (err) {
            setError('Invalid Email or password')
            // toast.error('Invalid Email or password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit} className="login-card">
                <div className="login-header">
                    <h1 className="login-title">Sign In</h1>
                    <p className="login-subtitle">Welcome back! Please enter your details</p>
                </div>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <div className="login-field">
                    <label htmlFor="email" className="login-label">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />
                </div>

                <div className="login-field">
                    <label htmlFor="password" className="login-label">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="login-btn-primary"
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <button
                    type="button"
                    onClick={() => navigate({ to: '/register', search: returnTo ? { returnTo } : undefined })}
                    className="login-btn-secondary"
                >
                    Don't have an account? Sign Up
                </button>
            </form>
        </div>
    )
}
