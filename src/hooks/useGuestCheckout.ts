import { useCallback } from 'react'

export interface GuestCheckoutData {
  first_name: string
  last_name: string
  email: string
  phone: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface CartItem {
  id: number
  product_id: number
  product_name: string
  price: number
  quantity: number
}

const GUEST_CHECKOUT_KEY = 'guestCheckoutData'
const GUEST_CART_KEY = 'guestCart'
const GUEST_SESSION_KEY = 'guestSessionId'
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Hook for managing guest checkout flow
 * Handles session creation, data persistence, and order creation
 */
export function useGuestCheckout() {
  // Save checkout data to localStorage (client-side only)
  const saveCheckoutData = useCallback((data: GuestCheckoutData) => {
    if (typeof window === 'undefined') return ''
    
    const sessionData = {
      data,
      timestamp: Date.now(),
      sessionId: generateSessionId()
    }
    localStorage.setItem(GUEST_CHECKOUT_KEY, JSON.stringify(sessionData))
    return sessionData.sessionId
  }, [])

  // Retrieve checkout data from localStorage (client-side only)
  const getCheckoutData = useCallback((): GuestCheckoutData | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const saved = localStorage.getItem(GUEST_CHECKOUT_KEY)
      if (!saved) return null

      const sessionData = JSON.parse(saved)
      
      // Check if session has expired
      if (Date.now() - sessionData.timestamp > SESSION_EXPIRY_MS) {
        clearCheckoutData()
        return null
      }

      return sessionData.data
    } catch (error) {
      console.error('Error retrieving checkout data:', error)
      return null
    }
  }, [])

  // Clear checkout data (client-side only)
  const clearCheckoutData = useCallback(() => {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(GUEST_CHECKOUT_KEY)
    localStorage.removeItem(GUEST_SESSION_KEY)
  }, [])

  // Create guest order and generate WhatsApp link
  const createGuestOrder = useCallback(async (
    checkoutData: GuestCheckoutData,
    cartItems: CartItem[]
  ) => {
    try {
      const response = await fetch('/api/guest/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: checkoutData,
          items: cartItems
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create guest order')
      }

      const result = await response.json()
      
      // Clear session after successful order
      clearCheckoutData()
      
      return result
    } catch (error) {
      console.error('Error creating guest order:', error)
      throw error
    }
  }, [clearCheckoutData])

  // Validate checkout data
  const validateCheckoutData = useCallback((data: GuestCheckoutData): { valid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!data.first_name?.trim()) errors.push('First name is required')
    if (!data.last_name?.trim()) errors.push('Last name is required')
    if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Valid email is required')
    }
    if (!data.phone?.trim() || !/^[6-9]\d{9}$/.test(data.phone.replace(/\D/g, ''))) {
      errors.push('Valid 10-digit phone number is required')
    }
    if (!data.address_line_1?.trim()) errors.push('Address is required')
    if (!data.city?.trim()) errors.push('City is required')
    if (!data.state?.trim()) errors.push('State is required')
    if (!data.postal_code?.trim() || !/^\d{6}$/.test(data.postal_code.replace(/\s/g, ''))) {
      errors.push('Valid 6-digit postal code is required')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }, [])

  // Check if guest session is active
  const isGuestSessionActive = useCallback((): boolean => {
    const data = getCheckoutData()
    return data !== null
  }, [getCheckoutData])

  // Get formatted address for WhatsApp
  const getFormattedAddress = useCallback((data: GuestCheckoutData): string => {
    const lines = [
      data.address_line_1,
      data.address_line_2 && data.address_line_2,
      `${data.city}, ${data.state} ${data.postal_code}`,
      data.country
    ].filter(Boolean)
    return lines.join(', ')
  }, [])

  // Generate WhatsApp message with order details
  const generateWhatsAppMessage = useCallback((
    checkoutData: GuestCheckoutData,
    cartItems: CartItem[],
    orderId: string
  ): string => {
    const itemsList = cartItems
      .map(item => `• ${item.product_name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`)
      .join('\n')

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = subtotal >= 299 ? 0 : 49
    const total = subtotal + shipping

    const message = `
*Order from AynBeauty* 🎀

*Customer Details:*
Name: ${checkoutData.first_name} ${checkoutData.last_name}
Email: ${checkoutData.email}
Phone: ${checkoutData.phone}

*Delivery Address:*
${getFormattedAddress(checkoutData)}

*Order Items:*
${itemsList}

*Order Summary:*
Subtotal: ₹${subtotal.toFixed(2)}
Shipping: ₹${shipping.toFixed(2)}
Total: ₹${total.toFixed(2)}

Order ID: ${orderId}

Please confirm this order. Thank you! 🙏
    `.trim()

    return message
  }, [getFormattedAddress])

  return {
    saveCheckoutData,
    getCheckoutData,
    clearCheckoutData,
    createGuestOrder,
    validateCheckoutData,
    isGuestSessionActive,
    getFormattedAddress,
    generateWhatsAppMessage
  }
}

/**
 * Helper function to generate unique session ID
 */
function generateSessionId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Helper to check if checkout data is expired
 */
export function isCheckoutSessionExpired(): boolean {
  if (typeof window === 'undefined') return true
  
  try {
    const saved = localStorage.getItem(GUEST_CHECKOUT_KEY)
    if (!saved) return true

    const sessionData = JSON.parse(saved)
    return Date.now() - sessionData.timestamp > SESSION_EXPIRY_MS
  } catch {
    return true
  }
}

/**
 * Helper to clear all guest data
 */
export function clearAllGuestData(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(GUEST_CHECKOUT_KEY)
  localStorage.removeItem(GUEST_SESSION_KEY)
  localStorage.removeItem(GUEST_CART_KEY)
}
