'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface Address {
  id: number;
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
}

interface DeliveryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }) => void;
  userEmail: string;
  userName: string;
  userPhone?: string;
}

export default function DeliveryDetailsModal({
  isOpen,
  onClose,
  onConfirm,
  userEmail,
  userName,
  userPhone
}: DeliveryDetailsModalProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [formData, setFormData] = useState({
    name: userName,
    phone: userPhone || '',
    email: userEmail,
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  useEffect(() => {
    if (isOpen) {
      fetchAddresses()
    }
  }, [isOpen])

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const shippingAddresses = data.addresses.filter((addr: Address) => addr.type === 'shipping')
        setAddresses(shippingAddresses)
        
        // Auto-select default address if available
        const defaultAddress = shippingAddresses.find((addr: Address) => addr.is_default)
        if (defaultAddress) {
          setSelectedAddress(defaultAddress)
          setFormData({
            name: `${defaultAddress.first_name} ${defaultAddress.last_name}`,
            phone: defaultAddress.phone || userPhone || '',
            email: userEmail,
            address: `${defaultAddress.address_line_1}${defaultAddress.address_line_2 ? ', ' + defaultAddress.address_line_2 : ''}`,
            city: defaultAddress.city,
            state: defaultAddress.state,
            pincode: defaultAddress.postal_code
          })
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address)
    setUseNewAddress(false)
    setFormData({
      name: `${address.first_name} ${address.last_name}`,
      phone: address.phone || userPhone || '',
      email: userEmail,
      address: `${address.address_line_1}${address.address_line_2 ? ', ' + address.address_line_2 : ''}`,
      city: address.city,
      state: address.state,
      pincode: address.postal_code
    })
  }

  const handleNewAddress = () => {
    setUseNewAddress(true)
    setSelectedAddress(null)
    setFormData({
      name: userName,
      phone: userPhone || '',
      email: userEmail,
      address: '',
      city: '',
      state: '',
      pincode: ''
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      alert('Please fill all required fields')
      return
    }
    
    onConfirm(formData)
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Delivery Details
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading addresses...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Address Selection */}
                    {addresses.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-3">Select Address</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {addresses.map((address) => (
                            <div
                              key={address.id}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedAddress?.id === address.id
                                  ? 'border-pink-500 bg-pink-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => handleAddressSelect(address)}
                            >
                              <div className="font-medium">
                                {address.first_name} {address.last_name}
                                {address.is_default && (
                                  <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {address.address_line_1}{address.address_line_2 && `, ${address.address_line_2}`}
                              </div>
                              <div className="text-sm text-gray-600">
                                {address.city}, {address.state} {address.postal_code}
                              </div>
                              {address.phone && (
                                <div className="text-sm text-gray-600">Phone: {address.phone}</div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <button
                          type="button"
                          onClick={handleNewAddress}
                          className="mt-3 text-pink-600 hover:text-pink-700 text-sm font-medium"
                        >
                          + Use a new address
                        </button>
                      </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address *
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="Street address, apartment, suite, etc."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700"
                      >
                        Proceed to WhatsApp
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}