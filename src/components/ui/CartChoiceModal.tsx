'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'

interface CartChoiceModalProps {
  isOpen: boolean
  onLogin: () => void
  onContinueAsGuest: () => void
  isLoading?: boolean
}

export default function CartChoiceModal({
  isOpen,
  onLogin,
  onContinueAsGuest,
  isLoading = false
}: CartChoiceModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">View Your Cart</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-8 text-center">
            Choose how you'd like to proceed with your cart
          </p>

          {/* Option 1: Login */}
          <button
            onClick={onLogin}
            disabled={isLoading}
            className="w-full mb-4 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Login to My Account
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Option 2: Guest Checkout */}
          <button
            onClick={onContinueAsGuest}
            disabled={isLoading}
            className="w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue as Guest
          </button>

          {/* Info */}
          <p className="text-xs text-gray-500 text-center mt-6">
            As a guest, you can view your cart and proceed to checkout without creating an account
          </p>
        </div>
      </div>
    </div>
  )
}
