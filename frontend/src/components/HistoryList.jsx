import { useEffect, useState } from 'react'
import apiClient from '../api/client.js'

function HistoryList({ refreshKey }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadHistory() {
      setLoading(true)
      setError(null)
      try {
        const { data } = await apiClient.get('/history', { params: { page: 1, page_size: 10 } })
        if (!cancelled) setItems(Array.isArray(data?.items) ? data.items : [])
      } catch {
        if (!cancelled) setError('Could not load history.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadHistory()
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  if (loading) return <p>Loading history…</p>
  if (error) return <p className="error-text">{error}</p>
  if (items.length === 0) return <p>No predictions yet.</p>

  return (
    <div className="history-list">
      <h2>Recent predictions</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id} className="history-item">
            <img src={item.image_url} alt={item.prediction} className="history-thumb" />
            <div>
              <p className="history-prediction">{item.prediction.replaceAll('_', ' ')}</p>
              <p className="history-meta">
                {(item.confidence * 100).toFixed(1)}% · {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default HistoryList
