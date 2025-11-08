'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { useImageCache } from '@/contexts/ImageCacheContext'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { 
  FireIcon,
  SparklesIcon,
  NewspaperIcon
} from '@heroicons/react/24/solid'

interface ProductImage {
  id: number | null
  product_id: number
  image_url: string
  is_primary: boolean
  sort_order: number
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  discounted_price?: number
  stock_quantity: number
  category: string
  image_url?: string
  primary_image?: string
  is_trending: boolean
  is_must_have: boolean
  is_new_arrival: boolean
  created_at: string
  updated_at: string
}

interface ProductFormData {
  name: string
  description: string
  price: string
  discounted_price: string
  stock_quantity: string
  category: string
  is_trending: boolean
  is_must_have: boolean
  is_new_arrival: boolean
}

interface UploadedImage {
  url: string
  filename: string
  originalName: string
  size: number
}

export default function AdminInventory() {
  const { refreshImages } = useImageCache()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    discounted_price: '',
    stock_quantity: '',
    category: '',
    is_trending: false,
    is_must_have: false,
    is_new_arrival: false
  })
  
  // Separate state for image handling
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // Categories must match database category names exactly
  const categories = [
    'Skincare',
    'Lips', 
    'Bath & Body',  // Changed from "Bath and Body"
    'Fragrances',
    'Eyes',
    'Nails',
    'Combo Sets'
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/admin/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Fetch products error:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchProductImages = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}/images`)
      const data = await response.json()
      if (data.success) {
        setExistingImages(data.images || [])
        const primaryIndex = data.images.findIndex((img: ProductImage) => img.is_primary)
        setPrimaryImageIndex(primaryIndex >= 0 ? primaryIndex : 0)
      }
    } catch (error) {
      console.error('Error fetching product images:', error)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const openModal = async (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        discounted_price: product.discounted_price ? product.discounted_price.toString() : '',
        stock_quantity: product.stock_quantity.toString(),
        category: product.category,
        is_trending: product.is_trending,
        is_must_have: product.is_must_have,
        is_new_arrival: product.is_new_arrival
      })
      await fetchProductImages(product.id)
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        discounted_price: '',
        stock_quantity: '',
        category: '',
        is_trending: false,
        is_must_have: false,
        is_new_arrival: false
      })
      setExistingImages([])
    }
    
    setSelectedFiles([])
    setUploadedImages([])
    setImagePreviews([])
    setPrimaryImageIndex(0)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      discounted_price: '',
      stock_quantity: '',
      category: '',
      is_trending: false,
      is_must_have: false,
      is_new_arrival: false
    })
    setSelectedFiles([])
    setExistingImages([])
    setUploadedImages([])
    setImagePreviews([])
    setPrimaryImageIndex(0)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length < 1 || files.length > 5) {
      alert('Please select between 1-5 images')
      return
    }

    // Check file sizes (warn if files are large but don't block)
    const maxSizeBytes = 5 * 1024 * 1024 // 5MB recommended limit
    const largeFiles = files.filter(file => file.size > maxSizeBytes)
    
    if (largeFiles.length > 0) {
      const fileNames = largeFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB)`).join('\n')
      const confirmed = confirm(`Warning: These files are large and may fail to upload due to server limits:\n\n${fileNames}\n\nRecommended: Use images under 5MB each.\n\nContinue anyway?`)
      
      if (!confirmed) {
        e.target.value = '' // Clear the file input
        return
      }
    }

    // Check for very large files (likely to fail)
    const veryLargeFiles = files.filter(file => file.size > 50 * 1024 * 1024) // 50MB
    if (veryLargeFiles.length > 0) {
      alert('Some files are extremely large (>50MB) and will likely fail to upload. Please compress or resize these images.')
      e.target.value = '' // Clear the file input
      return
    }

    setSelectedFiles(files)
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
    setPrimaryImageIndex(0)
  }

  const removeSelectedFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    setSelectedFiles(newFiles)
    setImagePreviews(newPreviews)
    
    if (primaryImageIndex >= newFiles.length) {
      setPrimaryImageIndex(Math.max(0, newFiles.length - 1))
    }
  }

  const removeExistingImage = async (imageId: number) => {
    if (!editingProduct) return
    
    try {
      const response = await fetch(`/api/products/${editingProduct.id}/images?imageId=${imageId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setExistingImages(prev => prev.filter(img => img.id !== imageId))
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const setPrimaryExistingImage = async (imageId: number) => {
    if (!editingProduct) return
    
    try {
      const response = await fetch(`/api/products/${editingProduct.id}/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId })
      })
      
      if (response.ok) {
        setExistingImages(prev => prev.map(img => ({
          ...img,
          is_primary: img.id === imageId
        })))
      }
    } catch (error) {
      console.error('Error setting primary image:', error)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('No authentication token found. Please login again.')
        return
      }

      // Check if token looks valid (basic validation)
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format');
        }
        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          alert('Your session has expired. Please login again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        console.log('🔐 Token payload:', payload);
      } catch (tokenError) {
        console.error('🔐 Token validation error:', tokenError);
        alert('Invalid authentication token. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      setIsUploading(true)
      let imageUrls: UploadedImage[] = []

      if (!editingProduct && selectedFiles.length === 0) {
        alert('Please select at least 1 image for the product')
        setIsUploading(false)
        return
      }

      if (selectedFiles.length > 0) {
        const imageFormData = new FormData()
        
        selectedFiles.forEach(file => {
          imageFormData.append('images', file)
        })
        
        const uploadResponse = await fetch('/api/upload/image', {
          method: 'POST',
          body: imageFormData
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          imageUrls = uploadResult.images
          setUploadedImages(imageUrls)
        } else {
          const errorData = await uploadResponse.json().catch(() => ({ error: 'Upload failed' }));
          
          // Handle specific upload errors
          if (uploadResponse.status === 413) {
            alert('File(s) too large! Server configuration limits the upload size to 1MB. Please:\n\n1. Use smaller images (under 1MB each)\n2. Compress your images\n3. Or contact administrator to increase server limits');
            setIsUploading(false);
            return;
          }
          
          if (errorData.code === 'PAYLOAD_TOO_LARGE') {
            alert(`Upload Error: ${errorData.error}\n\nDetails: ${errorData.details}`);
            setIsUploading(false);
            return;
          }
          
          throw new Error(errorData.error || 'Failed to upload images')
        }
      }

      const url = editingProduct 
        ? `/api/admin/inventory?id=${editingProduct.id}`
        : '/api/admin/inventory'
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      const requestPayload = {
        ...formData,
        image_urls: imageUrls.map(img => img.url),
        primary_image_index: primaryImageIndex,
        price: parseFloat(formData.price),
        discounted_price: formData.discounted_price ? parseFloat(formData.discounted_price) : null,
        stock_quantity: parseInt(formData.stock_quantity)
      }

      // Debug logging
      console.log('🔍 Request Debug Info:');
      console.log('URL:', url);
      console.log('Method:', method);
      console.log('Token present:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'None');
      console.log('Payload:', requestPayload);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      })

      console.log('📡 Response Status:', response.status);
      console.log('📡 Response OK:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.log('📡 Error Response:', errorData);
        
        if (response.status === 409 && errorData.error === 'Product already exists') {
          alert(errorData.message || 'A product with this name already exists. Please use a different name.');
          return;
        }
        
        throw new Error(errorData.error || `Failed to save product: ${response.status}`)
      }

      await fetchProducts()
      refreshImages() // Refresh image cache to show newly uploaded images
      closeModal()
    } catch (error) {
      console.error('Save product error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save product';
      alert(errorMessage);
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/admin/inventory?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      await fetchProducts()
    } catch (error) {
      console.error('Delete product error:', error)
      alert('Failed to delete product')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <button
            onClick={() => openModal()}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Product
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={categoryFilter}
                onChange={handleCategoryFilter}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <PhotoIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        {product.discounted_price ? (
                          <>
                            <span className="line-through text-gray-500">₹{product.price}</span>
                            <span className="text-pink-600 font-medium">₹{product.discounted_price}</span>
                          </>
                        ) : (
                          <span>₹{product.price}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {product.is_trending && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <FireIcon className="h-3 w-3 mr-1" />
                            Trending
                          </span>
                        )}
                        {product.is_must_have && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <SparklesIcon className="h-3 w-3 mr-1" />
                            Featured
                          </span>
                        )}
                        {product.is_new_arrival && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <NewspaperIcon className="h-3 w-3 mr-1" />
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discounted Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="discounted_price"
                    value={formData.discounted_price}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images (1-5 images required)
                </label>
                
                {editingProduct && existingImages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {existingImages.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <img 
                            src={image.image_url} 
                            alt={`Product ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          {image.is_primary && (
                            <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1 rounded">
                              Primary
                            </div>
                          )}
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setPrimaryExistingImage(image.id!)}
                              className="bg-blue-600 text-white text-xs px-1 rounded mr-1 hover:bg-blue-700"
                              title="Set as primary"
                            >
                              <StarIcon className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeExistingImage(image.id!)}
                              className="bg-red-600 text-white text-xs px-1 rounded hover:bg-red-700"
                              title="Delete image"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleFileSelect}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  required={!editingProduct && existingImages.length === 0}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Select 1-5 product images (JPEG, PNG, WebP - Max 100MB each)
                </p>
                
                {selectedFiles.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Selected Images ({selectedFiles.length}):
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={preview} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          {index === primaryImageIndex && (
                            <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1 rounded">
                              Primary
                            </div>
                          )}
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setPrimaryImageIndex(index)}
                              className="bg-blue-600 text-white text-xs px-1 rounded mr-1 hover:bg-blue-700"
                              title="Set as primary"
                            >
                              <StarIcon className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(index)}
                              className="bg-red-600 text-white text-xs px-1 rounded hover:bg-red-700"
                              title="Remove image"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            {selectedFiles[index].name}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedFiles.length > 1 && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Primary Image:
                        </label>
                        <select
                          value={primaryImageIndex}
                          onChange={(e) => setPrimaryImageIndex(parseInt(e.target.value))}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        >
                          {selectedFiles.map((file, index) => (
                            <option key={index} value={index}>
                              Image {index + 1}: {file.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Tags</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_trending"
                      checked={formData.is_trending}
                      onChange={handleFormChange}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 flex items-center">
                      <FireIcon className="h-4 w-4 text-red-500 mr-1" />
                      Trending Product
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_must_have"
                      checked={formData.is_must_have}
                      onChange={handleFormChange}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 flex items-center">
                      <SparklesIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      Must Have / Featured
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_new_arrival"
                      checked={formData.is_new_arrival}
                      onChange={handleFormChange}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 flex items-center">
                      <NewspaperIcon className="h-4 w-4 text-green-500 mr-1" />
                      New Arrival
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700 disabled:opacity-50"
                >
                  {isUploading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}