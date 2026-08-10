import { useState } from 'react'
import apiClient from '../api/client.js'

function UploadForm({ onPredicted }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] ?? null
    setFile(selected)
    setError(null)
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!file) {
      setError('Please choose an image first.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

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
      <label className="upload-dropzone" htmlFor="leaf-image">
        {previewUrl ? (
          <img src={previewUrl} alt="Selected leaf preview" className="upload-preview" />
        ) : (
          <span>Click to choose a mango leaf photo</span>
        )}
      </label>
      <input
        id="leaf-image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        hidden
      />

      <button type="submit" disabled={loading || !file}>
        {loading ? 'Analyzing…' : 'Check leaf'}
      </button>

      {error && <p className="error-text">{error}</p>}
    </form>
  )
}

export default UploadForm
