import { useState } from "react"
import * as authService from '../services/auth.service'
import { useAuthStore } from "../store/auth.store"
import { useNavigate } from "@tanstack/react-router"

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            let { success, data } = await authService.login({ email, password })
            console.log(success, data)


            if (success) {
                await useAuthStore().login(data)
                navigate({ to: '/' })
            }
        } catch (err) {
            setError('Invalid Email or password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <form
                onSubmit={handleSubmit}
                style={{ width: '100%', maxWidth: '380px', padding: '24px', border: '1px solid #ccc', borderRadius: '8px' }}
            >
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign In</h1>

                {error && (
                    <div style={{ color: '#d32f2f', marginBottom: '16px', padding: '8px', border: '1px solid #d32f2f', borderRadius: '4px', backgroundColor: '#ffebee' }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '6px' }}>
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '6px' }}>
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{ width: '100%', padding: '10px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    )
}
