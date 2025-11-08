'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams?.get('redirect') || '/'

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    setIsSubmitting(true)
    setLoading(true)
    setError('')

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password')
        setLoading(false)
        setIsSubmitting(false)
        return
      }

      // Call unified login API
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed')
      }

      // Store authentication data
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      // Redirect based on role
      if (data.isAdmin) {
        // Admin users go to admin dashboard
        router.push('/admin')
      } else {
        // Regular users go to redirect URL or home
        router.push(redirectUrl)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login'
      setError(errorMessage)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="AYN Beauty"
            width={120}
            height={40}
            className="h-12 w-auto"
            priority
          />
        </Link>
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">
          Welcome back!
        </h1>
        <p className="text-center text-sm text-gray-600">
          Sign in to your AYN Beauty account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
          {/* Info message */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Sign in with any account:</span> Whether you're an admin or customer, use the same login form
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                <p className="font-medium">Sign in failed</p>
                <p>{error}</p>
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-700 disabled:cursor-not-allowed transition"
                placeholder="you@example.com"
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent pr-10 disabled:bg-gray-700 disabled:cursor-not-allowed transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full bg-pink-600 text-white py-2 px-4 rounded-md font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Sign up link */}
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-pink-600 hover:text-pink-500 transition"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
