import { useState } from 'react'
import { Upload, X, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { paymentAPI } from '../utils/api'

const UploadReceipt = () => {
  const { user } = useAuth()
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [month, setMonth] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image (JPG, PNG) or PDF file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setSelectedFile(file)
    setError('')

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!selectedFile) {
      setError('Please select a file to upload')
      return
    }

    if (!month || !amount) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('receipt', selectedFile)
      formData.append('month', month)
      formData.append('amount', amount)
      formData.append('notes', notes)

      // Upload receipt
      await paymentAPI.uploadReceipt(formData)

      setSuccess(true)

      // Reset form
      setTimeout(() => {
        setSelectedFile(null)
        setPreviewUrl(null)
        setMonth('')
        setAmount('')
        setNotes('')
        setSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error uploading receipt:', error)
      setError(error.response?.data?.message || 'Failed to upload receipt')
    } finally {
      setLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="max-w-3xl">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Upload Payment Receipt</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Submit proof of cash payment
        </p>
      </div>

      {/* Info Alert */}
      <div className="mb-6 flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-400">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium mb-1">Upload Guidelines:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
            <li>Accepted formats: JPG, PNG, PDF</li>
            <li>Maximum file size: 5MB</li>
            <li>Receipt must be clear and readable</li>
            <li>Include transaction date and amount</li>
          </ul>
        </div>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="mb-6 flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Receipt uploaded successfully! Pending admin verification.</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Upload Form */}
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="label">Receipt File *</label>
            {!selectedFile ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG or PDF (MAX. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={handleFileSelect}
                />
              </label>
            ) : (
              <div className="relative border-2 border-gray-300 dark:border-gray-700 rounded-lg p-4">
                {previewUrl ? (
                  <div className="mb-3">
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      className="w-full h-48 object-contain bg-gray-50 dark:bg-gray-800 rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium truncate">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Payment Month *</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="input"
                required
              >
                <option value="">Select month</option>
                {months.map(m => (
                  <option key={m} value={`${m} ${currentYear}`}>
                    {m} {currentYear}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Amount Paid ($) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label">Additional Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input min-h-[100px] resize-none"
              placeholder="Add any additional information..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null)
                setPreviewUrl(null)
                setMonth('')
                setAmount('')
                setNotes('')
                setError('')
              }}
              className="btn btn-secondary"
              disabled={loading}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !selectedFile}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload Receipt'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Recent Uploads */}
      <div className="card p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Recent Uploads</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <FileText className="w-10 h-10 text-primary-600" />
              <div>
                <p className="font-medium">January 2025 Payment</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Uploaded on Jan 5, 2025
                </p>
              </div>
            </div>
            <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
              Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadReceipt
