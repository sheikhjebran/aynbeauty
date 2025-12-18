'use client'

// Force dynamic rendering to avoid digest mismatches
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { TrashIcon, EyeIcon, CloudArrowDownIcon } from '@heroicons/react/24/outline'
import AdminLayout from '@/components/AdminLayout'

interface UnusedFile {
  filename: string
  size: number
  sizeFormatted: string
  lastModified: string
  lastModifiedFormatted: string
  daysOld: number
}

interface CleanupHistoryItem {
  id: number
  files_deleted: number
  files_failed: number
  space_saved: number
  spaceSavedFormatted: string
  cleanup_type: string
  admin_user_id: number | null
  created_at: string
  createdAtFormatted: string
}

interface ImageAnalysis {
  totalFiles: number
  referencedFiles: number
  unusedFiles: number
  missingFilesCount: number
  totalUnusedSize: number
  totalUnusedSizeFormatted: string
  unusedFilesDetails: UnusedFile[]
  missingFiles: string[]
}

interface CleanupResults {
  mode: string
  totalFilesToDelete: number
  deletedFiles: string[]
  failedFiles: { filename: string, error: string }[]
  spaceSaved: number
  spaceSavedFormatted: string
}

export default function ImageCleanupPage() {
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null)
  const [history, setHistory] = useState<CleanupHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [cleanupResults, setCleanupResults] = useState<CleanupResults | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const fetchAnalysis = async (includeHistory = false) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const historyParam = includeHistory ? '?history=true' : ''
      const response = await fetch(`/api/admin/cleanup-images${historyParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnalysis(data.analysis)
        if (data.history) {
          setHistory(data.history)
        }
      } else {
        alert('Failed to fetch image analysis')
      }
    } catch (error) {
      console.error('Error fetching analysis:', error)
      alert('Error fetching analysis')
    }
    setLoading(false)
  }

  const performCleanup = async (mode: 'dry-run' | 'execute') => {
    if (selectedFiles.size === 0 && mode === 'execute') {
      alert('Please select files to delete')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const filesParam = selectedFiles.size > 0 
        ? `&files=${Array.from(selectedFiles).join(',')}`
        : ''
      
      const response = await fetch(`/api/admin/cleanup-images?mode=${mode}${filesParam}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCleanupResults(data.results)
        setShowResults(true)
        
        if (mode === 'execute') {
          // Refresh analysis after actual deletion
          setTimeout(fetchAnalysis, 1000)
          setSelectedFiles(new Set())
        }
      } else {
        alert('Failed to perform cleanup')
      }
    } catch (error) {
      console.error('Error performing cleanup:', error)
      alert('Error performing cleanup')
    }
    setLoading(false)
  }

  const toggleFileSelection = (filename: string) => {
    const newSelection = new Set(selectedFiles)
    if (newSelection.has(filename)) {
      newSelection.delete(filename)
    } else {
      newSelection.add(filename)
    }
    setSelectedFiles(newSelection)
  }

  const selectAllFiles = () => {
    if (analysis && selectedFiles.size < analysis.unusedFilesDetails.length) {
      setSelectedFiles(new Set(analysis.unusedFilesDetails.map(f => f.filename)))
    } else {
      setSelectedFiles(new Set())
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [])

  if (loading && !analysis) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing images...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Image Cleanup Management</h1>
          <p className="mt-2 text-gray-600">
            Manage and clean up unused product images from your uploads directory
          </p>
        </div>

        {/* Analysis Summary */}
        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Total Files</h3>
              <p className="text-3xl font-bold text-blue-600">{analysis.totalFiles}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Referenced Files</h3>
              <p className="text-3xl font-bold text-green-600">{analysis.referencedFiles}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Unused Files</h3>
              <p className="text-3xl font-bold text-orange-600">{analysis.unusedFiles}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Space to Reclaim</h3>
              <p className="text-3xl font-bold text-red-600">{analysis.totalUnusedSizeFormatted}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => fetchAnalysis(false)}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <CloudArrowDownIcon className="h-4 w-4 mr-2" />
              Refresh Analysis
            </button>
            
            <button
              onClick={() => fetchAnalysis(true)}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            >
              <CloudArrowDownIcon className="h-4 w-4 mr-2" />
              Load with History
            </button>
            
            <button
              onClick={() => performCleanup('dry-run')}
              disabled={loading || !analysis || analysis.unusedFiles === 0}
              className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              Preview Cleanup
            </button>
            
            <button
              onClick={() => performCleanup('execute')}
              disabled={loading || !analysis || selectedFiles.size === 0}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Selected ({selectedFiles.size})
            </button>
          </div>
        </div>

        {/* Unused Files List */}
        {analysis && analysis.unusedFiles > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Unused Files</h2>
                <button
                  onClick={selectAllFiles}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedFiles.size === analysis.unusedFilesDetails.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Filename
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Modified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age (Days)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analysis.unusedFilesDetails.map((file) => (
                    <tr key={file.filename} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(file.filename)}
                          onChange={() => toggleFileSelection(file.filename)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {file.filename}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {file.sizeFormatted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {file.lastModifiedFormatted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          file.daysOld > 30 ? 'bg-red-100 text-red-800' :
                          file.daysOld > 7 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {file.daysOld} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Missing Files Warning */}
        {analysis && analysis.missingFiles.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-medium text-yellow-800 mb-4">
              ⚠️ Missing Files ({analysis.missingFiles.length})
            </h3>
            <p className="text-yellow-700 mb-4">
              The following files are referenced in the database but missing from disk:
            </p>
            <div className="bg-yellow-100 rounded p-4 max-h-40 overflow-y-auto">
              {analysis.missingFiles.map((file) => (
                <div key={file} className="text-sm text-yellow-800">
                  {file}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Modal */}
        {showResults && cleanupResults && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cleanup Results
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Mode: <span className="font-medium">{cleanupResults.mode}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Files {cleanupResults.mode === 'execute' ? 'deleted' : 'to delete'}: 
                  <span className="font-medium"> {cleanupResults.deletedFiles.length}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Space {cleanupResults.mode === 'execute' ? 'saved' : 'to save'}: 
                  <span className="font-medium"> {cleanupResults.spaceSavedFormatted}</span>
                </p>
              </div>

              {cleanupResults.failedFiles.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-red-600 mb-2">Failed Files:</h4>
                  {cleanupResults.failedFiles.map((failed) => (
                    <div key={failed.filename} className="text-sm text-red-600">
                      {failed.filename}: {failed.error}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setShowResults(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Unused Files */}
        {analysis && analysis.unusedFiles === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-green-800">
              ✅ No Unused Files Found
            </h3>
            <p className="text-green-700 mt-2">
              All files in your uploads directory are currently being used by products in your database.
            </p>
          </div>
        )}

        {/* Cleanup History */}
        {history.length > 0 && (
          <div className="bg-white rounded-lg shadow mt-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Cleanup History (Last 10 Operations)</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Files Deleted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Failed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Space Saved
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.createdAtFormatted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.cleanup_type === 'manual' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.cleanup_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.files_deleted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.files_failed > 0 ? (
                          <span className="text-red-600">{item.files_failed}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.spaceSavedFormatted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </div>
      </div>
    </AdminLayout>
  )
}