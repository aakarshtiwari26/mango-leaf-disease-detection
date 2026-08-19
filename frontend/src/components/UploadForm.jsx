import { useRef, useState } from 'react'
import apiClient from '../api/client.js'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function UploadForm({ onPredicted }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const applyFile = (selected) => {
    if (!selected) return
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError('Please choose a JPEG, PNG, or WebP image.')
      return
    }
    setFile(selected)
    setError(null)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  const handleFileChange = (event) => {
    applyFile(event.target.files?.[0] ?? null)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    applyFile(event.dataTransfer.files?.[0] ?? null)
  }

  const handleReset = () => {
    setFile(null)
    setPreviewUrl(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!file) {
      setError('Please choose an image first.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('client_language', navigator.language || '')
    formData.append('client_timezone', Intl.DateTimeFormat().resolvedOptions().timeZone || '')

    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.post('/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onPredicted({ ...data, localPreviewUrl: previewUrl })
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <label
        className={`upload-dropzone${isDragging ? ' upload-dropzone--dragging' : ''}`}
        htmlFor="leaf-image"
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Selected leaf preview" className="upload-preview" />
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon" aria-hidden="true">📷</span>
            <span className="upload-primary-text">Drag & drop a leaf photo here</span>
            <span className="upload-secondary-text">or click to browse — JPEG, PNG, WebP</span>
          </div>
        )}
      </label>
      <input
        id="leaf-image"
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        hidden
      />

      {file && (
        <div className="upload-filename">
          <span>📎 {file.name}</span>
          <button type="button" className="upload-clear-btn" onClick={handleReset}>
            Remove
          </button>
        </div>
      )}

      <button type="submit" className="upload-submit-btn" disabled={loading || !file}>
        {loading ? (
          <>
            <span className="spinner" aria-hidden="true" /> Analyzing…
          </>
        ) : (
          'Check leaf'
        )}
      </button>

      {error && <p className="error-text">{error}</p>}
    </form>
  )
}

export default UploadForm
