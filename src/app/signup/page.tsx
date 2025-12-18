'use client'

// Force dynamic rendering to avoid digest mismatches
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function SignUpPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    password: '',
    confirm_password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name) {
      setError('First name and last name are required')
      return false
    }
    if (!formData.email) {
      setError('Email is required')
      return false
    }
    if (!formData.mobile || formData.mobile.length < 10) {
      setError('Valid mobile number is required')
      return false
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Account created successfully!')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 z-10" />
          <Image
            src="/images/auth/signup-beauty.jpg"
            alt="Beauty signup"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center p-8">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Join AynBeauty</h2>
              <p className="text-xl opacity-90">
                Discover your perfect beauty products and join thousands of happy customers
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8">
            {/* Logo */}
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-pink-600 hover:text-pink-500">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Form */}
            <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    placeholder="First name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter your email"
                />
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter your mobile number"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              {/* Terms */}
              <div className="text-center">
                <p className="text-xs text-gray-600">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-pink-600 hover:text-pink-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-pink-600 hover:text-pink-500">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
