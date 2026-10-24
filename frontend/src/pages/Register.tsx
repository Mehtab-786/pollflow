import { useState } from "react"
import * as authService from '../services/auth.service'
import { useAuthStore } from "../store/auth.store"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { toast } from "sonner"
import '../styles/register.styles.css'

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()
    const search = useSearch({ strict: false }) as { returnTo?: string; redirect?: string }
    const returnTo = search?.returnTo || search?.redirect
    const { login } = useAuthStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            let { success, data } = await authService.register({ username, email, password })

            if (success) {
                login(data)
                toast.success(`Account created successfully! Welcome, ${data.username}!`)
                navigate({ to: (returnTo || '/') as any })
            }
        } catch (err) {
            setError('Registration failed. Please check your credentials.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit} className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Sign Up</h1>
                    <p className="auth-subtitle">Create your account to get started</p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <div className="auth-field">
                    <label htmlFor="username" className="auth-label">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        placeholder="Enter your username"
                        onChange={(e) => setUsername(e.target.value)}
                        className="auth-input"
                        required
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="email" className="auth-label">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="auth-input"
                        required
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="password" className="auth-label">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="auth-btn-primary"
                >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>

                <button
                    type="button"
                    onClick={() => navigate({ to: '/login', search: returnTo ? { returnTo } : undefined })}
                    className="auth-btn-secondary"
                >
                    Already have an account? Sign In
                </button>
            </form>
        </div>
    )
}
